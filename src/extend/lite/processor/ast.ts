import generate from "@babel/generator"
import { parse } from "@babel/parser"
import traverse, { type NodePath } from "@babel/traverse"
import {
    arrayExpression,
    binaryExpression,
    type CallExpression,
    type Expression,
    isArrayExpression,
    isIdentifier,
    isStringLiteral,
    isTemplateLiteral,
    type ObjectProperty,
    stringLiteral
} from "@babel/types"
import { type ClassValue } from "src/extend/lite"
import { parser } from "src/extend/lite/processor/parser"
import { type ReplacerOptions } from "src/extend/lite/replacer"

function isExceptionCondition(path: NodePath<Expression>) {
    return !(path.isStringLiteral() || path.isTemplateLiteral() || path.isArrayExpression() || path.isObjectExpression())
}

export function transformer(
    code: string,
    callee: ReplacerOptions["callee"] = "twg"
) {
    const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"]
    })

    const callees = typeof callee === "string" ? [callee] : callee

    callees.forEach((name) => {
        if (!name) return
        traverse(ast, {
            CallExpression(path) {
                const chosenCallee = (path: NodePath<CallExpression>) => path.get("callee").isIdentifier({ name })
                if (chosenCallee(path)) {
                    path.traverse({
                        CallExpression(path) {
                            if (chosenCallee(path)) {
                                path.replaceWith(
                                    arrayExpression(path.node.arguments as Expression[])
                                )
                            }
                        }
                    })

                    path.traverse({
                        ObjectExpression(innerPath) {
                            if (
                                !innerPath.findParent(
                                    parentPath => parentPath.isObjectExpression() && parentPath.node === innerPath.node
                                ) && !(innerPath.node.properties[0] as ObjectProperty).shorthand
                            ) {
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

                                innerPath.traverse({
                                    ObjectProperty(innerPath) {
                                        if (
                                            !isStringLiteral(innerPath.node.key)
                                            && !isIdentifier(innerPath.node.key)
                                        ) {
                                            innerPath.remove()
                                        } else if (
                                            !innerPath.node.shorthand
                                            && !isStringLiteral(innerPath.node.value)
                                            && !isArrayExpression(innerPath.node.value)
                                            && !isTemplateLiteral(innerPath.node.value)
                                        ) innerPath.node.value = stringLiteral("🚀")
                                    }
                                })

                                try {
                                    innerPath.replaceWith(stringLiteral(
                                        parser(...new Function(`return [${generate(innerPath.node).code}]`)() as ClassValue[])
                                    ))
                                } catch { return code }
                            }
                        }
                    })
                }
            }
        })
    })

    return generate(ast).code
}
