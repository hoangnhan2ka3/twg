import { type ClassValue } from "src"
import { combiner } from "src/processor/combiner"
import { extractor } from "src/processor/extractor"
import { parser } from "src/processor/parser"

export interface ReplacerOptions {
    callee?: string | string[],
    nestingCallee?: string | string[],
    separator?: string | false,
    debug?: boolean
}

/**
 * Transforms the content before Tailwind scans/extracting its classes.
 * @param {ReplacerOptions} [options = {callee="twg", separator=":", debug=true}] callee, separator, debug. See [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-content#replacer-options).
 * @param {string} content The content already provided by `content.files` in `tailwind.config`.
 * @returns `(content: string) => string`
 */
export function replacer({
    callee = "twg",
    separator = ":",
    debug = true
}: ReplacerOptions = {}) {
    return (content: string) => {
        // 0. Check whether callee? is valid
        if (!callee) {
            debug && console.error("⛔ TWG - Error: `callee` is not valid.")
            return content
        }

        try {
            // 1. Loop through each largest Object
            extractor(content, callee).forEach(largestObject => {
                // 2. Parse conditional
                const filteredObject = (/:\s*(?:\d|[[('"`]|true|false)/g).test(largestObject)
                    ? combiner(largestObject)
                    : ""

                try {
                    // 3. Parse the arguments inside through `twg()` API
                    const parsedObject = parser({ separator })(
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
