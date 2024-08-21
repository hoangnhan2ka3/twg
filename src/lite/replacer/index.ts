import { type ClassValue } from "src/lite"
import { createTwg } from "src/lite/twg"
import { extractOuterObjects } from "src/replacer/extractors"

export interface ReplacerLiteOption {
    callee?: string | string[]
}

const replaceTernaryClasses = /!*?\w+\s*(?:[=!]==?[^&|?]+)?\?\s*(['"`])(.*?)\1\s*:\s*\1(.*?)\1/gs
const replaceAndOrConsequent = /!*?\w+\s*(?:[=!]==?[^&|?]+)?(?:&&|\|\||\?\?|\?)\s*/g
const replaceAlternative = /\}\s*:\s*\{/gs

export default function replacer(option: ReplacerLiteOption = { callee: "twg" }) {
    return (content: string) => {
        if (option.callee === undefined || option.callee.length === 0) return content

        const calleeFunctionRegex = new RegExp(
            `${Array.isArray(option.callee) ? `(${option.callee.join("|")})` : option.callee}\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\)`, "gi"
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
