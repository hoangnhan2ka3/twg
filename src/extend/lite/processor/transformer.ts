import { parser } from "src/extend/lite/processor/ast"

interface TransformerOptions {
    callee?: string | string[]
}

function transformer({ callee = "twg" }: TransformerOptions = {}) {
    return (content: string) => {
        if (!callee) return content

        try {
            return parser(content, callee)
        } catch { return content }
    }
}

export { transformer, type TransformerOptions }
