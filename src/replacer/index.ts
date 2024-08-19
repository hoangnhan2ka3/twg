import { type ClassValue } from "src"
import { extractOuterObjects } from "src/replacer/extractors"
import { createTwg } from "src/twg"

export interface ReplacerOptions {
    callee?: string | string[],
    matchFunction?: RegExp | string,
    separator?: string | false
}

// type ReplacerOptions = {
//     separator: string | false
// } & ({
//     callee: string,
// } | {
//     matchFunction: RegExp | string,
// })

const replaceAndOr = /(?:!*?\w+)\s*(?:[=!]==?\s*[^&|?]*)?(?:&&|\|\||\?\?)/g // cond (=== prop) &&, ||, ??
const replaceTernary = /(?:!*?\w+)\s*(?:[=!]==?\s*[^?:]*)?\?\s*['"`](?<if>.*?)['"`]\s*:\s*['"`](?<el>.*?)['"`]/gs // cond (=== prop) ? <if> : <el>

/**
 * Transforms the content before Tailwind scans/extracting its classes.
 * @param options see [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-content#replacer-options)
 * @param content The content already provided by `content.files` in `tailwind.config`
 */
export function replacer({
    callee = "twg",
    matchFunction,
    separator = ":"
}: ReplacerOptions = {}) {
    return (content: string) => {
        // 0.1. Check whether callee? is valid
        if (!callee || callee.length === 0) {
            console.warn("⚠️ Warning: `callee` is not valid.")
            return content
        }

        // 0.2. Handle custom calleeFunctionRegex
        const sharedRegex = "\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\)"
        let calleeFunctionRegex = Array.isArray(callee)
            ? new RegExp(`(${callee.join("|")})${sharedRegex}`, "gi")
            : new RegExp(`${callee}${sharedRegex}`, "gi")

        // 0.3. Handle custom matchFunction
        if (matchFunction !== undefined) {
            if (typeof matchFunction === "string") {
                const match = (/^\/(.+)\/([gimsuy]*)$/i).exec(matchFunction)
                if (match) {
                    calleeFunctionRegex = new RegExp(match[1] ?? "", match[2])
                } else {
                    console.warn("⚠️ Warning: `matchFunction` is not valid.")
                }
            } else if (matchFunction instanceof RegExp) {
                calleeFunctionRegex = matchFunction
            }
        }

        try {
            // 1. Remove comments in content for easier processing
            let preprocessingContent = content

            preprocessingContent = preprocessingContent.replace(calleeFunctionRegex, (call) => {
                // 2. Find the Array of all callee function calls
                const largestObjects = extractOuterObjects(call)

                // 3. Loop through each largest Object
                return largestObjects.reduce((acc, largestObject) => {
                    // 3.5. Parse conditional
                    const filteredObject = (/[:].*['"`]/).exec(largestObject)
                        ? largestObject
                            .replace(replaceAndOr, "")
                            .replace(replaceTernary, '"$<if> $<el>"')
                            .trim()
                        : ""

                    try {
                        // 4. Parse the arguments inside through `twg()` API
                        const parsedObject = createTwg({ separator })(
                            ...new Function(`return [${filteredObject}]`)() as ClassValue[]
                        )
                        // 5. Replace the old largest object with parsed one
                        return acc.replace(largestObject, `"${parsedObject}"`)
                    } catch (errorParsing) {
                        console.warn(`\n⚠️ TWG: Problem occurred:\n${((errorParsing as Error).message)} in:\n- ${largestObject}\nTrying to be transformed into:\n+ ${filteredObject}`)
                        return acc
                    }
                }, call)
            })

            // DONE. Return the processed content
            return preprocessingContent
        } catch (errorOnContent) {
            console.error(`\n❌ TWG: Error occurred:\n${((errorOnContent as Error).message)} in content:\n${content}\n`)
            return content
        }
    }
}

export default replacer
