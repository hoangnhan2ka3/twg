import { type ClassValue, createTwg } from "src/index"
import { extractOuterObjects } from "src/replacer/extractors"

interface ReplacerOptions {
    callee?: string,
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

const replaceAndOr = /(?:!*?\w+)\s*(?:[=!]==?\s*[^&|?]*)?(?:&&|\|\||\?\?)\s*/gs // cond (=== prop) &&, ||, ??
const replaceTernary = /(?:!*?\w+)\s*(?:[=!]==?\s*[^?:]*)?\?\s*(?<q1>['"`])(?<m1>.*?)\k<q1>\s*:\s*(?<q2>['"`])(?<m2>.*?)\k<q2>/gis // cond (=== prop) ? <m1> : <m2>
const replaceComment = /\s*((?<!https?:)\/\/.*|\{?\/\*+\s*\n?([^*]*|(\*(?!\/)))*\*\/\}?)/g // (// ... | /* ... */ | {/* ... */})
const replaceObjectsSeparator = /,?\s*\}\s*,[^{}]*\{/gs // }, ... { => collapse multiple objects

/**
 * Transforms the content before Tailwind scans its classes.
 * @param options see [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#replacer-options)
 * @param content The content provided by `content.files`
 */
function replacer({
    callee = "twg",
    matchFunction,
    separator = ":"
}: ReplacerOptions = {}) {
    return (content: string) => {
        // 0. Check if callee? is valid
        if (callee.length === 0) {
            console.warn("⚠️ Warning: `callee` is not valid.")
            return content
        }

        // 0. Handle custom calleeFunctionRegex
        let calleeFunctionRegex = new RegExp(`${callee}\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\)`, "gis")
        if (matchFunction !== undefined) {
            if (typeof matchFunction === "string") {
                const match = (/^\/(.+)\/([gimsuy]*)$/).exec(matchFunction)
                if (match !== null) {
                    calleeFunctionRegex = new RegExp(match[1] ?? "", match[2])
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
                    const parsedString = largestObject.includes(":")
                        ? largestObject
                            .replace(replaceAndOr, "")
                            .replace(replaceTernary, '"$<m1> $<m2>"')
                            .trim()
                        : ""
                    try {
                        // 5. Parse the arguments inside the largest object
                        const parsedArgs = createTwg({ separator })(
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
            console.error(`\n❌ An Error occurred:\n${(errorOnFile as Error).message} in file\n${content}\n`)
            return content
        }
    }
}

export { replacer, type ReplacerOptions }
