import generate from "@babel/generator"
import { parse } from "@babel/parser"
import traverse, { type NodePath } from "@babel/traverse"
import {
    arrayExpression,
    binaryExpression,
    type Expression,
    isArrayExpression,
    isIdentifier,
    isStringLiteral,
    isTemplateLiteral,
    numericLiteral,
    type ObjectProperty,
    stringLiteral
} from "@babel/types"
import { type ClassValue, createTwg } from "src/extend"
import { type TransformerOptions } from "src/extend/processor/transformer"

/**
 * Check whether consequent or alternate of a ternary conditional is a binding identifier.
 * @param {NodePath<Expression>} path consequent or alternate path of a ternary conditional.
 * @returns {boolean} `boolean`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
function isExceptionCondition(path: NodePath<Expression>) {
    return !(path.isStringLiteral() || path.isTemplateLiteral() || path.isArrayExpression() || path.isObjectExpression())
}

/**
 * Use AST to transform the conditionals, especially the `nesting` Object conditionals or `nesting` kinds of ternary conditionals.
 * @param {string} code input code.
 * @param {TransformerOptions} options callee, nestingCallee, separator, debug. See [docs](https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#transformer-options).
 * @returns {string} `string`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
function parser(
    code: string,
    options: TransformerOptions = {}
) {
    const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"]
    })

    const callees = typeof options.callee === "string" ? [options.callee] : options.callee ?? ["twg"]

    callees.forEach((name) => {
        if (!name) return
        traverse(ast, {
            CallExpression(path) {
                // 1. Find callee function
                if (path.get("callee").isIdentifier({ name })) {
                    path.traverse({
                        CallExpression(innerPath) {
                            const nestingCallees = typeof options.nestingCallee === "string" ? [options.nestingCallee] : options.nestingCallee ?? callees
                            nestingCallees.forEach((name) => {
                                if (innerPath.get("callee").isIdentifier({ name })) {
                                    innerPath.replaceWith(
                                        arrayExpression(innerPath.node.arguments as Expression[])
                                    )
                                }
                            })
                        }
                    })

                    path.traverse({
                        ObjectExpression(innerPath) {
                            // 2. Find outer Object(s) inside callee function
                            if (
                                !innerPath.findParent(
                                    parentPath => parentPath.isObjectExpression() && parentPath.node === innerPath.node
                                ) && !(innerPath.node.properties[0] as ObjectProperty).shorthand
                            ) {
                                // 3. First parse ternary and logical conditionals
                                innerPath.traverse({
                                    LogicalExpression(innerPath) {
                                        innerPath.replaceWith(innerPath.node.right)
                                    },
                                    ConditionalExpression(innerPath) {
                                        innerPath.replaceWith(
                                            isExceptionCondition(innerPath.get("consequent")) ? innerPath.node.alternate
                                                : isExceptionCondition(innerPath.get("alternate")) ? innerPath.node.consequent
                                                    : innerPath.findParent((parent) => parent.isTemplateLiteral()) ? [innerPath.node.consequent, stringLiteral(" "), innerPath.node.alternate].reduce((acc, current) => binaryExpression("+", acc, current))
                                                        : arrayExpression([innerPath.node.consequent, innerPath.node.alternate])
                                        )
                                    }
                                })

                                // 4. And parse the values if it is conditional
                                innerPath.traverse({
                                    ObjectProperty(innerPath) {
                                        if (
                                            !isStringLiteral(innerPath.node.key)
                                            && !isIdentifier(innerPath.node.key)
                                        ) {
                                            innerPath.remove()
                                        } else if (
                                            !isStringLiteral(innerPath.node.value)
                                            && !isArrayExpression(innerPath.node.value)
                                            && !isTemplateLiteral(innerPath.node.value)
                                        ) innerPath.node.value = numericLiteral(1)
                                    }
                                })

                                // 5. Then take the outer Object(s) out
                                const largestObject = generate(innerPath.node).code

                                try {
                                    // DONE. Final replace the original outer Object(s) with parsed one
                                    innerPath.replaceWith(stringLiteral(
                                        createTwg(options)(...new Function(
                                            `return [${largestObject}]`
                                        )() as ClassValue[])
                                    ))
                                } catch (e) {
                                    options.debug && console.warn(`\n⚠️ TWG - Problem occurred on \`transformer()\`, please read the \`Usage / Use cases\` section on the docs carefully:\n${((e as Error).message)} in:\n${largestObject}`)
                                    return code
                                }
                            }
                        }
                    })
                }
            }
        })
    })

    return generate(ast).code
}

export { parser }
