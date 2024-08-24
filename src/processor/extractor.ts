import { type ReplacerOptions } from "src/replacer"

/**
 * Extracts the largest Object(s) inside the callee function.
 * @param content The content already provided by `content.files` in `tailwind.config`.
 * @param callee The name of the function to be scanned. Default is `twg`.
 * @returns string[]
 */
export function extractor(
    content: string,
    callee: ReplacerOptions["callee"] = "twg"
): string[] {
    let depth = 0,
        objectStart = -1,
        inTemplateLiteral = false,
        inCallee = false,
        calleeDepth = 0

    const objects = []

    for (let i = 0; i < content.length; i++) {
        const char = content[i]

        // Handle template literals
        if (char === "`") {
            inTemplateLiteral = !inTemplateLiteral
            continue
        }

        // Skip template literals
        if (inTemplateLiteral) continue

        // Check if the current char is in any of the calleeList
        for (const calleeName of Array.isArray(callee) ? callee : [callee]) {
            if (content.slice(i, i + calleeName.length + 1) === `${calleeName}(`) {
                inCallee = true
                calleeDepth = 1
                i += calleeName.length
                break
            }
        }

        if (inCallee) {
            // Handle callee
            if (char === "(") {
                calleeDepth++
            } else if (char === ")") {
                calleeDepth--
                if (calleeDepth === 0) {
                    inCallee = false
                }
            }

            // Handle objects
            if (char === "{") {
                if (depth === 0) {
                    objectStart = i
                }
                depth++
            } else if (char === "}") {
                depth--
                if (depth === 0 && objectStart !== -1) {
                    objects.push(content.slice(objectStart, i + 1))
                    objectStart = -1
                }
            }
        }
    }

    return objects
}
