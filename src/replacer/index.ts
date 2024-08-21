import { type ClassValue } from "src/index"
import { extractOuterObjects } from "src/replacer/extractors"
import { createTwg } from "src/twg"

export interface ReplacerOptions {
    callee?: string | string[],
    matchFunction?: RegExp | string,
    separator?: string | false
}

const defaultCallee = "twg"

const replaceAndOr = /(?:!*?\w+)\s*(?:[=!]==?[^&|?]+)?(?:&&|\|\||\?\?)\s*/g // cond (=== prop) &&, ||, ??
const replaceTernaryClasses = /!*?\w+\s*(?:[=!]==?[^&|?]+)?\?\s*(['"`])(.*?)\1\s*:\s*\1(.*?)\1/gs // cond (=== prop) ? $2 : $3
const replaceTernaryObjects = /!*?\w+\s*(?:[=!]==?[^&|?]+)?\?\s*(\{.*?\})\s*:\s*(\{.*?\})/gs // cond (=== prop) ? {$1} : {$2}

/**
 * Transforms the content before Tailwind scans/extracting its classes.
 * @param options see [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-content#replacer-options)
 * @param content The content already provided by `content.files` in `tailwind.config`
 */
export function replacer(options: ReplacerOptions = {}) {
    return (content: string) => {
        // 0.1. Check whether callee? is valid
        if (options.callee === undefined || options.callee.length === 0) {
            options.callee = defaultCallee
            console.warn("⚠️ Warning: `callee` is not valid. Using default value.")
        }

        // 0.2. Handle custom calleeFunctionRegex
        const tailRegex = "\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\)"
        let calleeFunctionRegex = new RegExp(
            `${Array.isArray(options.callee) ? `(${options.callee.join("|")})` : options.callee}${tailRegex}`, "gi"
        )

        // 0.3. Handle custom matchFunction
        if (options.matchFunction !== undefined) {
            if (typeof options.matchFunction === "string") {
                const match = (/^\/(.+)\/([gimsuy]{0,6})$/i).exec(options.matchFunction)
                if (match?.[1]) {
                    calleeFunctionRegex = new RegExp(match[1], match[2])
                } else {
                    console.warn("⚠️ Warning: `matchFunction` is not valid. Using default value.")
                }
            } else if (options.matchFunction instanceof RegExp) {
                calleeFunctionRegex = options.matchFunction
            }
        }

        let tmpContent = content
        try {
            tmpContent = tmpContent.replace(calleeFunctionRegex, (call) => {
                // 1. Find the Array of all callee function calls
                const largestObjects = extractOuterObjects(call)

                // 2. Loop through each largest Object
                return largestObjects.reduce((acc, largestObject) => {
                    // 2.5. Parse conditional
                    const filteredObject = (/:.*['"`]/s).exec(largestObject)
                        ? largestObject
                            .replace(replaceAndOr, "")
                            .replace(replaceTernaryClasses, '"$2 $3"')
                            .replace(replaceTernaryObjects, "$1, $2")
                        : ""

                    try {
                        // 3. Parse the arguments inside through `twg()` API
                        const parsedObject = createTwg({ separator: options.separator })(
                            ...new Function(`return [${filteredObject}]`)() as ClassValue[]
                        )
                        // 4. Replace the old largest object with parsed one
                        return acc.replace(largestObject, `"${parsedObject}"`)
                    } catch (errorParsing) {
                        console.warn(`\n⚠️ TWG: Problem occurred on \`replacer()\`:\n${((errorParsing as Error).message)} in:\n- ${largestObject}\nTrying to be transformed into:\n+ ${filteredObject}`)
                        return acc
                    }
                }, call)
            })

            // DONE. Return the processed content
            return tmpContent
        } catch (errorOnContent) {
            console.error(`\n❌ TWG: Error occurred on \`replacer()\`:\n${((errorOnContent as Error).message)} in content:\n${content}\n`)
            return content
        }
    }
}

export default replacer
