import { type ClassValue } from "src/lite"
import { parser } from "src/lite/lite-processor/parser"
import { transformConditional } from "src/processor/ast"
import { extractor } from "src/processor/extractor"

export interface ReplacerLiteOption {
    callee?: string | string[]
}

export function replacer({ callee = "twg" }: ReplacerLiteOption = {}) {
    return (content: string) => {
        if (callee.length === 0) return content

        content = transformConditional(content)
        try {
            extractor(content, callee).forEach(largestObject => {
                const filteredObject = (/['"`]/).test(largestObject)
                    ? largestObject.replace(/:[\s\w(!)&|?]+(?=\s*,|\s*\})/g, ": 1")
                    : ""

                try {
                    const parsedObject = parser({ flatten: true })(
                        ...new Function(`return [${filteredObject}]`)() as ClassValue[]
                    )
                    content = content.replace(largestObject, `"${parsedObject}"`)
                } catch { /* empty */ }
            })

            return content
        } catch { return content }
    }
}

export default replacer
