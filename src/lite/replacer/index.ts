import { type ClassValue } from "src/lite"
import { createTwg } from "src/lite/twg"
import { extractOuterObjects } from "src/replacer/extractors"

export interface ReplacerLiteOption {
    callee?: string | string[]
}

const replaceTernaryClasses = /!*?\w+\s*(?:[=!]==?[^&|?]+)?\?\s*(['"`])(.*?)\1\s*:\s*\1(.*?)\1/gs
const replaceAndOrConsequent = /!*?\w+\s*(?:[=!]==?[^&|?]+)?(?:&&|\|\||\?\?|\?)\s*/g
const replaceAlternative = /\}\s*:\s*\{/gs

export default function replacer({ callee = "twg" }: ReplacerLiteOption = {}) {
    return (content: string) => {
        if (callee.length === 0) callee = "twg"
        const calleeFunctionRegex = new RegExp(
            `${Array.isArray(callee) ? `(${callee.join("|")})` : callee}\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\)`, "gi"
        )

        let tmpContent = content
        try {
            tmpContent = tmpContent.replace(calleeFunctionRegex, (call) => {
                const largestObjects = extractOuterObjects(call)

                return largestObjects.reduce((acc, largestObject) => {
                    const filteredObject = (/:.*['"`]/s).exec(largestObject)
                        ? largestObject
                            .replace(replaceTernaryClasses, '"$2 $3"')
                            .replace(replaceAndOrConsequent, "")
                            .replace(replaceAlternative, "}, {")
                        : ""

                    try {
                        const parsedObject = createTwg(
                            ...new Function(`return [${filteredObject}]`)() as ClassValue[]
                        )
                        return acc.replace(largestObject, `"${parsedObject}"`)
                    } catch (e) { return acc }
                }, call)
            })

            return tmpContent
        } catch (e) { return content }
    }
}
