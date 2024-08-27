import generate from "@babel/generator"
import * as parser from "@babel/parser"
import traverse from "@babel/traverse"
import * as types from "@babel/types"

/**
 * Use AST to transform the conditionals, especially the `nesting` Object conditionals or `nesting` kinds of ternary conditionals.
 * @param code input as string
 * @returns string
 */
export function transformer(code: string, callee?: string | string[]) {
    const ast = parser.parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"]
    })

    const callees = typeof callee === "string" ? [callee] : callee ?? ["twg"]

    callees.forEach((name) => {
        traverse(ast, {
            CallExpression(path) {
                if (path.get("callee").isIdentifier({ name })) {
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
                                !types.isStringLiteral(path.node.value)
                                && !types.isArrayExpression(path.node.value)
                                && !types.isTemplateLiteral(path.node.value)
                            ) path.node.value = types.numericLiteral(1)
                        }
                    })
                }
            }
        })
    })

    return generate(ast).code
}
