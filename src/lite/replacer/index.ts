import { type ClassValue } from "src/lite"
import { parser } from "src/lite/lite-processor/parser"
import { extractor } from "src/processor/extractor"

export interface ReplacerLiteOption {
    callee?: string | string[]
}

const replaceTernaryClasses = /(?:!*\(*)*\w+[)\s]*(?:[=!]==?[^&|?]+)?\?\s*(['"`])(.*?)\1\s*:\s*\1(.*?)\1/gs
const replaceAndOrConsequent = /(?:!*\(*)*\w+[)\s]*(?:[=!]==?[^&|?]+)?(?:&&|\|\||\?\?|\?)\s*/g
const replaceAlternative = /\}\s*:\s*\{/gs

export function replacer({ callee = "twg" }: ReplacerLiteOption = {}) {
    return (content: string) => {
        if (callee.length === 0) callee = "twg"

        try {
            extractor(content, callee).forEach(largestObject => {
                const filteredObject = (/['"`]/).test(largestObject)
                    ? largestObject
                        .replace(replaceTernaryClasses, '"$2 $3"')
                        .replace(replaceAndOrConsequent, "")
                        .replace(replaceAlternative, "}, {")
                    : ""

                try {
                    const parsedObject = parser()(
                        ...new Function(`return [${filteredObject}]`)() as ClassValue[]
                    )
                    content = content.replace(largestObject, `"${parsedObject}"`)
                } catch (e) { /* empty */ }
            })

            return content
        } catch (e) { return content }
    }
}

export default replacer
