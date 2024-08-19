export function extractOuterObjects(content: string): string[] {
    let depth = 0,
        objectStart = -1,
        inTemplateLiteral = false,
        expressionDepth = 0

    const objects = []

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
        } else if (char === "}" && expressionDepth === 0) {
            if (depth === 1 && objectStart !== -1) {
                objects.push(content.slice(objectStart, i + 1)) // Thêm object vào mảng
                objectStart = -1 // Reset objectStart cho object tiếp theo
            }
            depth--
        }
    }

    return objects
}
