import generate from "@babel/generator"
import * as barser from "@babel/parser"
import traverse, { type NodePath } from "@babel/traverse"
import * as types from "@babel/types"
import { type ClassValue } from "src/extend/lite"
import { parser } from "src/extend/lite/processor/parser"
import { type ReplacerOptions } from "src/extend/lite/replacer"

function isExceptionCondition(path: NodePath<types.Expression>) {
    return !(path.isStringLiteral() || path.isTemplateLiteral() || path.isArrayExpression() || path.isObjectExpression())
}

export function transformer(
    code: string,
    callee: ReplacerOptions["callee"] = "twg"
) {
    const ast = barser.parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"]
    })

    const callees = typeof callee === "string" ? [callee] : callee

    callees.forEach((name) => {
        if (!name) return
        traverse(ast, {
            CallExpression(path) {
                const chosenCallee = (path: NodePath<types.CallExpression>) => path.get("callee").isIdentifier({ name })
                if (chosenCallee(path)) {
                    path.traverse({
                        CallExpression(path) {
                            if (chosenCallee(path)) {
                                path.replaceWith(
                                    types.arrayExpression(path.node.arguments as types.Expression[])
                                )
                            }
                        }
                    })

                    path.traverse({
                        ObjectExpression(innerPath) {
                            if (
                                !innerPath.findParent(
                                    parentPath => parentPath.isObjectExpression() && parentPath.node === innerPath.node
                                ) && !(innerPath.node.properties[0] as types.ObjectProperty).shorthand
                            ) {
                                innerPath.traverse({
                                    LogicalExpression(innerPath) {
                                        innerPath.replaceWith(innerPath.node.right)
                                    },
                                    ConditionalExpression(innerPath) {
                                        innerPath.replaceWith(
                                            isExceptionCondition(innerPath.get("consequent")) ? innerPath.node.alternate
                                                : isExceptionCondition(innerPath.get("alternate")) ? innerPath.node.consequent
                                                    : innerPath.findParent((parent) => parent.isTemplateLiteral()) ? [innerPath.node.consequent, types.stringLiteral(" "), innerPath.node.alternate].reduce((acc, current) => types.binaryExpression("+", acc, current))
                                                        : types.arrayExpression([innerPath.node.consequent, innerPath.node.alternate])
                                        )
                                    }
                                })

                                innerPath.traverse({
                                    ObjectProperty(innerPath) {
                                        if (
                                            !types.isStringLiteral(innerPath.node.key)
                                            && !types.isIdentifier(innerPath.node.key)
                                        ) {
                                            innerPath.remove()
                                        } else if (
                                            !innerPath.node.shorthand
                                            && !types.isStringLiteral(innerPath.node.value)
                                            && !types.isArrayExpression(innerPath.node.value)
                                            && !types.isTemplateLiteral(innerPath.node.value)
                                        ) innerPath.node.value = types.stringLiteral("🚀")
                                    }
                                })

                                try {
                                    innerPath.replaceWith(types.stringLiteral(
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
