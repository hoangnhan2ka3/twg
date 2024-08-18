import { type ClassValue, twg } from "src"

export interface ReplacerOptions {
    callee?: string,
    objectIndex?: RegExp,
    separator?: string | false
}

const replaceAndOr = /(?:!*?\w+)\s*(?:[=!]==?\s*[^&|?]*)?(?:&&|\|\||\?\?)\s*/gs // cond (=== prop) &&, ||, ??
const replaceTernary = /(?:!*?\w+)\s*(?:[=!]==?\s*[^?:]*)?\?\s*(?<q1>['"`])(?<m1>.*?)\k<q1>\s*:\s*(?<q2>['"`])(?<m2>.*?)\k<q2>/gis // cond (=== prop) ? <m1> : <m2>
const replaceComment = /\s*((?<!https?:)\/\/.*|\{?\/\*+\s*\n?([^*]*|(\*(?!\/)))*\*\/\}?)/g // (// ... | /* ... */ | {/* ... */})
const replaceObjectsSeparator = /,?\s*\}\s*,[^{}]*\{/gs // }, ... { => collapse multiple objects

const defaultObjectIndex = /^\{/gm // catch first `{` of outer objects,

function replacer({
    callee = "twg",
    objectIndex = defaultObjectIndex,
    separator = ":"
}: ReplacerOptions = {}) {
    return (content: string) => {
        if (callee.length === 0) {
            console.warn("⚠️ Warning: `callee` is not valid.")
            return content
        }

        let filteredContent = content.replace(replaceComment, "")

        const calleeFunctionCalls = filteredContent.match(
            RegExp(`${callee}\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\)`, "gis")
        ) ?? [] // callee( ... )

        calleeFunctionCalls.forEach(call => {
            const paramsString = call
                .slice(callee.length + 1, -1)
                .replace(replaceObjectsSeparator, ",")
                .replace(replaceAndOr, "")
                .replace(replaceTernary, '"$<m1> $<m2>"')
                .trim()
            // console.log("result: ", paramsString)
            const parsedArgs = twg({ separator })(
                ...new Function(`return [${paramsString}]`)() as ClassValue[]
            )
            filteredContent = filteredContent.replace(call, `"${parsedArgs}"`)
        })

        return filteredContent
    }
}

export { replacer }
