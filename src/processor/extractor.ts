import { type TransformerOptions } from "src/processor/transformer"

/**
 * Extracts the largest Object(s) inside the callee function.
 * @param content The content already provided by `content.files` in `tailwind.config`.
 * @param callee The name of the function to be scanned. Default is `twg`.
 * @returns {string[]} `string[]`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
export function extractor(
    content: string,
    callee: TransformerOptions["callee"] = "twg"
) {
    let [cDepth, oDepth, objectStart] = [0, 0, -1],
        inCallee = false,
        inString = false

    const objects = []
    const calleeList = Array.isArray(callee) ? callee : [callee]

    for (let i = 0; i < content.length; i++) {
        const char = content[i]!

        if (["'", '"', "`"].includes(char)) {
            inString = !inString
            continue
        }

        const matchedCallee = calleeList.find(calleeName => content.startsWith(`${calleeName}(`, i))
        if (matchedCallee) {
            inCallee = true
            cDepth = 1
            i += matchedCallee.length
            continue
        }

        if (inCallee) {
            if (char === "(") cDepth++
            if (char === ")") cDepth--

            if (cDepth === 0) inCallee = false

            if (char === "{" && !inString) {
                if (oDepth === 0) objectStart = i
                oDepth++
            } else if (char === "}" && !inString) {
                oDepth--
                if (oDepth === 0 && objectStart !== -1) {
                    objects.push(content.slice(objectStart, i + 1))
                    objectStart = -1
                }
            }
        }

        if (["'", '"', "`"].includes(char)) {
            inString = !inString
        }
    }

    return objects
}
