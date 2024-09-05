import { type ClassValue } from "src"
import { parser } from "src/lite/processor/parser"
import { combiner } from "src/processor/combiner"
import { extractor } from "src/processor/extractor"

export interface ReplacerOptions {
    callee?: string | string[]
}

export function replacer({ callee = "twg" }: ReplacerOptions = {}) {
    return (content: string) => {
        if (!callee) return content

        try {
            extractor(content, callee).forEach(largestObject => {
                try {
                    const parsedObject = parser(
                        ...new Function(`return [${combiner(largestObject)}]`)() as ClassValue[]
                    )
                    content = content.replace(largestObject, `"${parsedObject}"`)
                } catch { /* empty */ }
            })

            return content
        } catch { return content }
    }
}

export default replacer
