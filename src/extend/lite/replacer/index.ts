import { transformer } from "src/extend/lite/processor/ast"

export interface ReplacerOptions {
    callee?: string | string[]
}

export function replacer({ callee = "twg" }: ReplacerOptions = {}) {
    return (content: string) => {
        if (!callee) return content

        try {
            return transformer(content, callee)
        } catch { return content }
    }
}

export default replacer
