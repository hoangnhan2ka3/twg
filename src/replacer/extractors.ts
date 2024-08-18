function extractOuterObjects(content: string): string {
    let depth = 0,
        maxDepth = 0,
        objectStart = -1,
        objectEnd = -1,
        inTemplateLiteral = false,
        expressionDepth = 0

    for (let i = 0; i < content.length; i++) {
        const char = content[i]

        if (char === "`") {
            inTemplateLiteral = !inTemplateLiteral
            continue
        }

        if (inTemplateLiteral) {
            if (content.substring(i, i + 2) === "${") {
                expressionDepth++
                i++
            } else if (char === "}" && expressionDepth > 0) {
                expressionDepth--
            }
            continue
        }

        if (char === "{" && expressionDepth === 0) {
            depth++
            if (depth === 1) {
                objectStart = i
            }
            if (depth > maxDepth) {
                maxDepth = depth
            }
        } else if (char === "}" && expressionDepth === 0) {
            if (depth === 1) {
                objectEnd = i
                break
            }
            depth--
        }
    }

    if (objectStart !== -1 && objectEnd !== -1) {
        return content.slice(objectStart, objectEnd + 1)
    }

    return ""
}

export { extractOuterObjects }
