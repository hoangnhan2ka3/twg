import generate from "@babel/generator"
import * as barser from "@babel/parser"
import traverse, { type NodePath } from "@babel/traverse"
import * as types from "@babel/types"
import { type ClassValue } from "src/lite"
import { parser } from "src/lite/processor/parser"
import { type ReplacerLiteOption } from "src/lite/replacer"

export function transformer(
    code: string,
    callee: ReplacerLiteOption["callee"] = "twg"
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
                            try {
                                if (!innerPath.findParent(parentPath => parentPath.isObjectExpression() && parentPath.node === innerPath.node)) {
                                    innerPath.traverse({
                                        ConditionalExpression(innerPath) {
                                            if (innerPath.findParent((parent) => parent.isTemplateLiteral())) {
                                                innerPath.replaceWith([
                                                    innerPath.node.consequent, types.stringLiteral(" "), innerPath.node.alternate
                                                ].reduce((acc, current) => types.binaryExpression("+", acc, current)))
                                            } else {
                                                innerPath.replaceWith(
                                                    types.arrayExpression([innerPath.node.consequent, innerPath.node.alternate])
                                                )
                                            }
                                        },
                                        LogicalExpression(innerPath) {
                                            innerPath.replaceWith(innerPath.node.right)
                                        }
                                    })

                                    innerPath.traverse({
                                        ObjectProperty(innerPath) {
                                            if (
                                                !innerPath.node.shorthand
                                                && !types.isStringLiteral(innerPath.node.value)
                                                && !types.isArrayExpression(innerPath.node.value)
                                                && !types.isTemplateLiteral(innerPath.node.value)
                                            ) innerPath.node.value = types.stringLiteral("NaN")
                                        }
                                    })

                                    const largestObject = generate(innerPath.node).code

                                    innerPath.replaceWith(types.stringLiteral(
                                        parser(...new Function(
                                            `return [${(/['"`]|:\s*1/g).test(largestObject) ? largestObject : ""}]`
                                        )() as ClassValue[])
                                    ))
                                }
                            } catch { return code }
                        }
                    })
                }
            }
        })
    })

    return generate(ast).code
}
