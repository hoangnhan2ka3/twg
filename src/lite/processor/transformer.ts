import { type ClassValue } from "src/index"
import { twg } from "src/lite"
import { combiner } from "src/processor/combiner"
import { extractor } from "src/processor/extractor"

export interface TransformerOptions {
    callee?: string | string[]
}

export function transformer({ callee = "twg" }: TransformerOptions = {}) {
    return (content: string) => {
        if (!callee) return content

        try {
            extractor(content, callee).forEach(largestObject => {
                try {
                    const parsedObject = twg(
                        ...new Function(`return [${combiner(largestObject)}]`)() as ClassValue[]
                    )
                    content = content.replace(largestObject, `"${parsedObject}"`)
                } catch { /* empty */ }
            })

            return content
        } catch { return content }
    }
}
