function extractOuterObjects(content: string): string {
    let depth = 0,
        maxDepth = 0,
        objectStart = -1,
        objectEnd = -1,
        inTemplateLiteral = false,
        expressionDepth = 0

    for (let i = 0; i < content.length; i++) {
        if (content[i] === "`") {
            inTemplateLiteral = !inTemplateLiteral
            continue
        }

        if (inTemplateLiteral) {
            if (content.substring(i, i + 2) === "${") {
                expressionDepth++
                i++
            } else if (content[i] === "}" && expressionDepth > 0) {
                expressionDepth--
            }
            continue
        }

        if (content[i] === "{" && expressionDepth === 0) {
            depth++
            if (depth === 1) {
                objectStart = i
            }
            if (depth > maxDepth) {
                maxDepth = depth
            }
        } else if (content[i] === "}" && expressionDepth === 0) {
            if (depth === 1) {
                objectEnd = i
                break
            }
            depth--
        }
    }

    if (objectStart !== -1 && objectEnd !== -1) {
        // console.log("content: ", content.slice(objectStart, objectEnd + 1))
        // console.log(objectStart, objectEnd + 1)
        return content.slice(objectStart, objectEnd + 1)
    }

    return ""
}

type Quote = '"' | "'" | "`"

function extractArgumentsIndex(
    matchIndex: number,
    matchLen: number,
    wholeText: string
) {
    const initialIndex = matchIndex + matchLen - 1
    const getQuote = (index: number): Quote | false => (
        ['"', "'", "`"].includes(wholeText[index] as Quote)
            ? (wholeText[index] as Quote)
            : false
    )
    const lastChar: string = wholeText[initialIndex - 1]!
    let isInString: Quote | false = false,
        balanceBracketCheck = 0,
        finalIndex: number | undefined = undefined

    for (let i = initialIndex; i < wholeText.length; i++) {
        const isQuote = getQuote(i)
        if (isQuote) {
            if (isInString === isQuote && lastChar !== "\\") {
                isInString = false
            } else {
                isInString = isQuote
            }
            continue
        }

        if (wholeText[i] === "{") {
            balanceBracketCheck++
            continue
        }

        if (wholeText[i] === "}") {
            if (--balanceBracketCheck === 0) {
                finalIndex = i + 1
                break
            }
        }
    }

    // console.log("wholeText: ", wholeText.slice(initialIndex, finalIndex))
    return wholeText.slice(initialIndex, finalIndex)
}

export { extractArgumentsIndex, extractOuterObjects }
