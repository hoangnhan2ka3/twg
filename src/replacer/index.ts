import { type ClassValue } from "src/index"
import { transformConditional } from "src/processor/ast"
import { extractor } from "src/processor/extractor"
import { parser } from "src/processor/parser"

export interface ReplacerOptions {
    callee?: string | string[],
    separator?: string | false,
    debug?: boolean
}

/**
 * Transforms the content before Tailwind scans/extracting its classes.
 * @param options callee, matchFunction, separator. See [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-content#replacer-options).
 * @param content The content already provided by `content.files` in `tailwind.config`.
 * @returns string
 */
export function replacer({
    callee = "twg",
    separator = ":",
    debug = true
}: ReplacerOptions = {}) {
    return (content: string) => {
        // 0. Check whether callee? is valid
        if (callee.length === 0) {
            debug && console.warn("⚠️ TWG - Warning: `callee` is not valid.")
            return content
        }

        // 1. Parse conditionals
        content = transformConditional(content)
        try {
            // 2. Loop through each largest Objects inside the callee function
            extractor(content, callee).forEach(largestObject => {
                const filteredObject = (/['"`]/).test(largestObject)
                    ? largestObject.replace(/:[\s\w(!)&|?]+(?=\s*,|\s*\})/g, ": 1")
                    : ""

                try {
                    // 3. Parse the Object inside
                    const parsedObject = parser({ separator, flatten: true })(
                        ...new Function(`return [${filteredObject}]`)() as ClassValue[]
                    )
                    // 4. Replace the old largest object with parsed one
                    content = content.replace(largestObject, `"${parsedObject}"`)
                } catch (errorParsing) {
                    debug && console.warn(`\n⚠️ TWG - Problem occurred on \`replacer()\`:\n${((errorParsing as Error).message)} in:\n- ${largestObject}\nTrying to be transformed into:\n+ ${filteredObject}`)
                }
            })

            // DONE. Return the processed content
            return content
        } catch (errorOnContent) {
            debug && console.error(`\n❌ TWG - Error occurred on \`replacer()\`:\n${((errorOnContent as Error).message)} in content:\n${content}\n`)
            return content
        }
    }
}

export default replacer
