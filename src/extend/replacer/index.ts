import { transformer } from "src/extend/processor/ast"

export interface ReplacerOptions {
    /**
     * Callee name to be scanned.
     * @default "twg"
     * @see {@link https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#-custom-callee}
     */
    callee?: string | string[],

    /**
     * Callee name to be accepted using inside main callee.
     * @default callee?
     * @see {@link https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#-custom-nestingcallee}
     */
    nestingCallee?: string | string[],

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
 * @param {ReplacerOptions} [options = {callee="twg", nestingCallee=undefined, separator=":", debug=true}] callee, nestingCallee, separator, debug. See [docs](https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#replacer-options).
 * @param {string} content The content already provided by `content.files` in `tailwind.config`.
 * @returns {string} `(content: string) => string`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
export function replacer({
    callee = "twg",
    nestingCallee,
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
            return transformer(content, { callee, nestingCallee, separator, debug })
        } catch { return content }
    }
}

export default replacer
