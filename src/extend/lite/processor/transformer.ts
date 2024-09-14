import { parser } from "src/extend/lite/processor/ast"

export interface TransformerOptions {
    callee?: string | string[]
}

export function transformer({ callee = "twg" }: TransformerOptions = {}) {
    return (content: string) => {
        if (!callee) return content

        try {
            return parser(content, callee)
        } catch { return content }
    }
}
