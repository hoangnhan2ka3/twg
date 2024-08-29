import { transformer } from "src/lite/processor/ast"

export interface ReplacerLiteOption {
    callee?: string | string[]
}

export function replacer({ callee = "twg" }: ReplacerLiteOption = {}) {
    return (content: string) => {
        if (!callee) return content

        try {
            return transformer(content, callee)
        } catch { return content }
    }
}

export default replacer
