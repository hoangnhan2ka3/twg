import { type ClassValue } from "src"
import { extractArgumentsIndex, extractOuterObjects } from "src/replacer/extractors"
import { createTwg } from "src/twg"

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

        const filteredContent = content.replace(replaceComment, "")

        const matchWholeFunction = `${callee}\\((?:[^()]*|\\((?:[^()]*|\\([^()]*\\))*\\))*\\)` // callee( ... )
        const calleeFunctionCalls = RegExp(matchWholeFunction, "gis").exec(filteredContent) ?? []

        const largestObjects = calleeFunctionCalls
            .map(calleeFunctionCall => extractOuterObjects(
                calleeFunctionCall.replace(replaceObjectsSeparator, ",")
            ))
            .filter(obj => obj !== "")
            .join("\n")

        try {
            return [...largestObjects.matchAll(objectIndex)].reduce((
                acc: string, //*
                matchArr: RegExpMatchArray
            ) => {
                const extractedArgs = extractArgumentsIndex(
                    matchArr.index!,
                    matchArr[0].length,
                    largestObjects
                )

                const currentTransform = extractedArgs
                    .replace(replaceAndOr, "")
                    .replace(replaceTernary, '"$<m1> $<m2>"')
                    .trim()

                try {
                    const parsedArgs = createTwg({ separator })(
                        ...new Function(`return [${currentTransform}]`)() as ClassValue[]
                    )
                    return acc.replace(extractedArgs, `"${parsedArgs}"`)
                } catch (errorParsing) {
                    console.warn(`
                        \n⚠️ Warning: Problem occurred:\n
                        \n${(errorParsing as Error).message} in:\n- ${extractedArgs}
                        \nTrying to be transformed into:\n+ ${currentTransform}
                    `)
                    return acc
                }
            }, filteredContent)
        } catch (errorOnFile) {
            console.error(`
                \n❌ Error: Error occurred:\n
                \n${(errorOnFile as Error).message} in file\n${content}\n
            `)
            return content
        }
    }
}

export { replacer }
