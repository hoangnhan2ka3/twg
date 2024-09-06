/**
 * Return closed bracket from a given open bracket.
 * @param openBracket Open bracket as input string.
 * @returns {string} `string`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
function getClosedBracket(openBracket: string) {
    const pairs = { "{": "}", "(": ")", "[": "]" } as Record<string, string>
    return pairs[openBracket] ?? openBracket
}

/**
 * Check whether the input string is identifier or call expression by first character of the string.
 * @param str Consequent or alternate of ternary expression.
 * @returns {boolean} `boolean`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
function isIdentifierOrCallExpression(str: string) {
    return (/^\w/).test(str)
}

const matchTernaryCondition = /(?:[!(\s])*\w+[)\s]*(?:[=!]==?[^&|?]+)?\?\s*/g
const replaceLogicalCondition = /(?:[!(\s])*\w+[)\s]*(?:[=!]==?[^&|?]+)?(?:&&|\|\||\?\?)\s*/g

/**
 * Remove the conditional statement of logical and ternary expression. Then combine consequent with alternate of ternary expression.
 * @param {string} content The content that need to be parsed.
 * @returns {string} `string`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
export function combiner(content: string) {
    content = content.replace(replaceLogicalCondition, "")
    if (!(/:\s*(?:\d|[[('"`]|true|false)/g).test(content)) return ""
    let matches = content.match(matchTernaryCondition)

    while (matches?.[0]) {
        const initialPoint = content.search(matchTernaryCondition) + matches[0].length
        let [balance, cStart, aStart] = [0, -1, -1],
            [cEntry, aEntry] = ["", ""],
            [cEnd, aEnd] = [0, 0],
            inString = false,
            isConsequent = true,
            inTemplateLiteral = false,
            [isCIdentifier, isAIdentifier] = [false, false]

        function balancer(c: string, e: string) {
            if (c === e && "{([".includes(c) && !inString) {
                balance++
            } else if (c === getClosedBracket(e) && !inString) {
                balance--
            } else if (["'", '"', "`"].includes(c)) {
                inString = !inString
                if (c === "`") inTemplateLiteral = !inTemplateLiteral
            }
        }

        // Identify if the ternary expression is within a template literal
        const templateLiteralStart = content.lastIndexOf("`", initialPoint)
        const templateLiteralEnd = content.indexOf("`", initialPoint)
        if (
            templateLiteralStart !== -1
            && templateLiteralEnd !== -1
            && templateLiteralStart < initialPoint
            && templateLiteralEnd > initialPoint
        ) {
            inTemplateLiteral = true
        } else {
            inTemplateLiteral = false
        }

        for (let i = initialPoint; i < content.length; i++) {
            const char = content[i]!
            if (char === " ") continue

            if (isConsequent) {
                if (cStart === -1) {
                    cStart = i
                    cEntry = char
                    balance++
                    continue
                }

                if (((/\w/).test(cEntry))) {
                    balance = 1
                    if (!(/[(\w)]/).test(char)) {
                        balance--
                        isCIdentifier = true
                    }
                } else {
                    balancer(char, cEntry)
                }

                if (balance === 0 && cEntry) {
                    cEnd = i + (isCIdentifier ? 0 : 1)
                    aStart = content.indexOf(":", cEnd) + 1
                    isConsequent = false
                    isCIdentifier = false
                    i = aStart
                    continue
                }
            } else {
                if (aEntry === "") {
                    aEntry = char
                    balance++
                    continue
                }

                if (((/\w/).test(aEntry))) {
                    balance = 1
                    if (!(/[(\w)]/).test(char)) {
                        balance--
                        isAIdentifier = true
                    }
                } else {
                    balancer(char, aEntry)
                }

                if (balance === 0 && aEntry) {
                    aEnd = i + (isAIdentifier ? 0 : 1)
                    isAIdentifier = false
                    break
                }
            }
        }

        let result: string

        const consequent = content.slice(cStart, cEnd).trim()
        const alternate = content.slice(aStart, aEnd).trim()
        const wholeTernary = matches[0] + content.slice(cStart, aEnd)

        // Determine result based on whether it's inside a template literal
        if (inTemplateLiteral) {
            result = `${consequent} + " " + ${alternate}`
        } else if (isIdentifierOrCallExpression(consequent) && isIdentifierOrCallExpression(alternate)) {
            result = "NaN"
        } else if (isIdentifierOrCallExpression(consequent)) {
            result = alternate
        } else if (isIdentifierOrCallExpression(alternate)) {
            result = consequent
        } else {
            result = `[${consequent}, ${alternate}]`
        }

        content = content.replace(wholeTernary, result)
        matches = content.match(matchTernaryCondition)
    }
    return content
}
