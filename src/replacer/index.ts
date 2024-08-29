import { transformer } from "src/processor/ast"

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
        if (!callee) {
            debug && console.error("⛔ TWG - Error: `callee` is not valid.")
            return content
        }

        try {
            return transformer(content, { callee, separator, debug })
        } catch { return content }
    }
}

export default replacer
