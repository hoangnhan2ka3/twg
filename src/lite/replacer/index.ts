import { type ClassValue } from "src/lite"
import { parser } from "src/lite/lite-processor/parser"
import { transformer } from "src/processor/ast"
import { extractor } from "src/processor/extractor"

export interface ReplacerLiteOption {
    callee?: string | string[]
}

export function replacer({ callee = "twg" }: ReplacerLiteOption = {}) {
    return (content: string) => {
        if (!callee) return content

        content = transformer(content, callee)
        try {
            extractor(content, callee).forEach(largestObject => {
                try {
                    content = content.replace(largestObject, `"${parser({ flatten: true })(
                        ...new Function(
                            `return [${(/['"`]/).test(largestObject) ? largestObject : ""}]`
                        )() as ClassValue[]
                    )}"`)
                } catch { /* empty */ }
            })

            return content
        } catch { return content }
    }
}

export default replacer
