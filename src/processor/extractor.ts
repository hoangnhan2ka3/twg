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

    const objects: string[] = []
    const calleeList = Array.isArray(callee) ? callee : [callee]

    for (let i = 0; i < content.length; i++) {
        const char = content[i]

        // Xử lý template literals
        if (char === "`") {
            inTemplateLiteral = !inTemplateLiteral
            continue
        }

        if (inTemplateLiteral) {
            continue
        }

        // Xác định nếu ký tự hiện tại nằm trong bất kỳ hàm gọi nào trong calleeList
        for (const calleeName of calleeList) {
            if (content.slice(i, i + calleeName.length + 1) === `${calleeName}(`) {
                inCallee = true
                calleeDepth = 1
                i += calleeName.length
                break
            }
        }

        if (inCallee) {
            if (char === "(") {
                calleeDepth++
            } else if (char === ")") {
                calleeDepth--
                if (calleeDepth === 0) {
                    inCallee = false
                }
            }

            // Xử lý đối tượng bên trong hàm gọi
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
