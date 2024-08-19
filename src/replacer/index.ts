import { type ClassValue } from "src"
import { extractOuterObjects } from "src/replacer/extractors"
import { createTwg } from "src/twg"

interface ReplacerOptions {
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

const replaceAndOr = /(?:!*?\w+)\s*(?:[=!]==?\s*[^&|?]*)?(?:&&|\|\||\?\?)\s*/g // cond (=== prop) &&, ||, ??
const replaceTernary = /(?:!*?\w+)\s*(?:[=!]==?\s*[^?:]*)?\?\s*['"`](?<if>.*?)['"`]\s*:\s*['"`](?<el>.*?)['"`]/gs // cond (=== prop) ? <if> : <el>
const replaceComment = /\s*((?<!https?:)\/\/.*|\{?\/\*+\s*\n?([^*]*|(\*(?!\/)))*\*\/\}?)/g // (// ... | /* ... */ | {/* ... */})
const replaceObjectsSeparator = /,?\s*\}\s*,[^{}]*\{/g // }, ... { => collapse multiple objects

/**
 * Transforms the content before Tailwind scans its classes.
 * @param options see [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#replacer-options)
 * @param content The content already provided by `content.files` in `tailwind.config`
 */
function replacer({
    callee = "twg",
    matchFunction,
    separator = ":"
}: ReplacerOptions = {}) {
    return (content: string) => {
        // 0.1. Check if callee? is valid
        if (callee.length === 0) {
            console.warn("⚠️ Warning: `callee` is not valid.")
            return content
        }

        // 0.2. Handle custom calleeFunctionRegex
        let calleeFunctionRegex = new RegExp("")
        const sharedRegex = "\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\)"
        if (Array.isArray(callee)) {
            const calleeRegexString = `(${callee.join("|")})`
            calleeFunctionRegex = new RegExp(`${calleeRegexString}${sharedRegex}`, "gi")
        } else if (typeof callee === "string") {
            calleeFunctionRegex = new RegExp(`${callee}${sharedRegex}`, "gi")
        }

        // 0.3. Handle custom matchFunction
        if (matchFunction !== undefined) {
            if (typeof matchFunction === "string") {
                const match = (/^\/(.+)\/([gimsuy]*)$/i).exec(matchFunction)
                if (match !== null) {
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
            let preprocessingContent = content.replace(replaceComment, "")
            // 2. Find all callee function calls
            const calleeFunctionCalls = preprocessingContent.match(calleeFunctionRegex) ?? [] // callee( ... )

            calleeFunctionCalls.forEach(call => {
                // 3. Merge multiple object(?), then find the largest object inside the callee function
                const largestObject = extractOuterObjects(call.replace(replaceObjectsSeparator, ","))
                // 4. Parse conditional strings
                if (largestObject) {
                    const parsedString = (/[:]\s*['"`]/).exec(largestObject)
                        ? largestObject
                            .replace(replaceAndOr, "")
                            .replace(replaceTernary, '"$<if> $<el>"')
                            .trim()
                        : ""
                    try {
                        // 5. Parse the arguments inside the largest object
                        // const parsedArgs = createTwg({ separator })(
                        const parsedArgs = createTwg()(
                            ...new Function(`return [${parsedString}]`)() as ClassValue[]
                        )
                        // 6. Replace the old largest object with parsed one
                        preprocessingContent = preprocessingContent.replace(largestObject, `"${parsedArgs}"`)
                    } catch (errorParsing) {
                        console.warn(`\n⚠️ Warning: Problem occurred:\n${(errorParsing as Error).message} in:\n- ${largestObject}\nTrying to be transformed into:\n+ ${parsedString}`)
                        return content
                    }
                }
            })
            // DONE. Return the processed content
            return preprocessingContent
        } catch (errorOnFile) {
            console.error(`\n❌ An error occurred:\n${(errorOnFile as Error).message} in file\n${content}\n`)
            return content
        }
    }
}

export { replacer, type ReplacerOptions }
export default replacer
