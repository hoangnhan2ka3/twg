import { type ClassValue, createTwg } from "src/index"
import { combiner } from "src/processor/combiner"
import { extractor } from "src/processor/extractor"

export interface TransformerOptions {
    /**
     * Callee name to be scanned.
     * @default "twg"
     * @see {@link https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#-custom-callee}
     */
    callee?: string | string[],

    /**
     * The divider between the key and class values.
     * @default ":"
     * @see {@link https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#-custom-separator}
     */
    separator?: string | false,

    /**
     * Printing debug messages in console if there are any warnings or errors.
     * @default true
     * @see {@link https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#-turn-off-debug}
     */
    debug?: boolean
}

/**
 * Transforms the content before Tailwind scans/extracting its classes.
 * @param {TransformerOptions} [options = {callee="twg", separator=":", debug=true}] callee, separator, debug. See [docs](https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#transformer-options).
 * @param {string} content The content already provided by `content.files` in `tailwind.config`.
 * @returns {string} `(content: string) => string`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
export function transformer({
    callee = "twg",
    separator = ":",
    debug = true
}: TransformerOptions = {}) {
    return (content: string) => {
        // 0. Check whether callee? is valid
        if (!callee) {
            debug && console.error("⛔ TWG - Error: `callee` is not valid.")
            return content
        }

        try {
            // 1. Loop through each largest Object
            extractor(content, callee).forEach(largestObject => {
                const filteredObject = combiner(largestObject)
                try {
                    // 3. Parse the arguments inside through `parser()` API
                    const parsedObject = createTwg({ separator })(
                        ...new Function(`return [${filteredObject}]`)() as ClassValue[]
                    )
                    // 4. Replace the old largest object with parsed one
                    content = content.replace(largestObject, `"${parsedObject}"`)
                } catch (errorParsing) {
                    debug && console.warn(`\n⚠️ TWG - Problem occurred on \`transformer()\`:\n${((errorParsing as Error).message)} in:\n- ${largestObject}\nTrying to be transformed into:\n+ ${filteredObject}`)
                }
            })

            // DONE. Return the processed content
            return content
        } catch (errorOnContent) {
            debug && console.error(`\n⛔ TWG - Error occurred on \`transformer()\`:\n${((errorOnContent as Error).message)} in content:\n${content}\n`)
            return content
        }
    }
}
