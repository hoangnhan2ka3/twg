import { transformer } from "src/extend/processor/ast"

export interface ReplacerOptions {
    callee?: string | string[],
    nestingCallee?: string | string[],
    separator?: string | false,
    debug?: boolean
}

/**
 * Transforms the content before Tailwind scans/extracting its classes.
 * @param {ReplacerOptions} [options = {callee="twg", nestingCallee=undefined, separator=":", debug=true}] callee, nestingCallee, separator, debug. See [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-content#replacer-options).
 * @param {string} content The content already provided by `content.files` in `tailwind.config`.
 * @returns `(content: string) => string`
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
