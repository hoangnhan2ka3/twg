import { type ClassValue } from "src/lite"
import { createTwg } from "src/lite/twg"
import { extractOuterObjects } from "src/replacer/extractors"

export interface ReplacerLiteOption {
    callee?: string | string[]
}

const replaceAndOr = /!*?\w+\s*([=!]==?[\s\S]+)?(&&|\|\||\?\?)\s*/g
const replaceTernary = /!*?\w+\s*([=!]==?[\s\S]+)?\?\s*(['"`])(.*?)\2\s*:\s*\2(.*?)\2/gs

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
                        ? largestObject.replace(replaceAndOr, "").replace(replaceTernary, '"$3 $4"')
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
