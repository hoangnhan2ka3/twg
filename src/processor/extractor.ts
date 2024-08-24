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
    let calleeDepth = 0,
        objectDepth = 0,
        objectStart = -1,
        inTemplateLiteral = false,
        inCallee = false

    const objects = []

    for (let i = 0; i < content.length; i++) {
        // Handle template literals
        if (content[i] === "`") {
            inTemplateLiteral = !inTemplateLiteral
            continue
        }

        // Skip template literals
        if (inTemplateLiteral) continue

        // Check if the current content[i] is in any of the calleeList
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
            if (content[i] === "(") {
                calleeDepth++
            } else if (content[i] === ")") {
                calleeDepth--
                if (calleeDepth === 0) {
                    inCallee = false
                }
            }

            // Handle objects
            if (content[i] === "{") {
                if (objectDepth === 0) objectStart = i
                objectDepth++
            } else if (content[i] === "}") {
                objectDepth--
                if (objectDepth === 0 && objectStart !== -1) {
                    objects.push(content.slice(objectStart, i + 1))
                    objectStart = -1
                }
            }
        }
    }

    return objects
}
