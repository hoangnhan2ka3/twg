import generate from "@babel/generator"
import * as barser from "@babel/parser"
import traverse from "@babel/traverse"
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
                if (path.get("callee").isIdentifier({ name })) {
                    path.traverse({
                        CallExpression(path) {
                            if (path.get("callee").isIdentifier({ name })) {
                                path.replaceWith(
                                    types.arrayExpression(path.node.arguments as types.Expression[])
                                )
                            }
                        }
                    })

                    path.traverse({
                        ObjectExpression(path) {
                            try {
                                if (!path.findParent((parentPath) => parentPath.isObjectExpression())) {
                                    path.traverse({
                                        ConditionalExpression(path) {
                                            if (path.findParent((parent) => parent.isTemplateLiteral())) {
                                                path.replaceWith([
                                                    path.node.consequent, types.stringLiteral(" "), path.node.alternate
                                                ].reduce((acc, current) => types.binaryExpression("+", acc, current)))
                                            } else {
                                                path.replaceWith(
                                                    types.arrayExpression([path.node.consequent, path.node.alternate])
                                                )
                                            }
                                        },
                                        LogicalExpression(path) {
                                            path.replaceWith(path.node.right)
                                        }
                                    })

                                    path.traverse({
                                        ObjectProperty(path) {
                                            if (
                                                !path.node.shorthand
                                                && !types.isStringLiteral(path.node.value)
                                                && !types.isArrayExpression(path.node.value)
                                                && !types.isTemplateLiteral(path.node.value)
                                            ) path.node.value = types.numericLiteral(1)
                                        }
                                    })

                                    const largestObject = generate(path.node).code
                                    path.replaceWith(types.stringLiteral(
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
