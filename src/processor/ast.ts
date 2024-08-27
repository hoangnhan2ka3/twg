import generate from "@babel/generator"
import * as parser from "@babel/parser"
import traverse from "@babel/traverse"
import * as types from "@babel/types"

/**
 * Use AST to transform the conditionals, especially the `nesting` Object conditionals or `nesting` kinds of ternary conditionals.
 * @param code input as string
 * @returns string
 */
export function transformer(code: string) {
    const ast = parser.parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"]
    })

    traverse(ast, {
        ConditionalExpression(path) {
            if (path.findParent((parent) => parent.isTemplateLiteral())) {
                const binaryExpression = types.binaryExpression("+", path.node.consequent, path.node.alternate)
                path.replaceWith(binaryExpression)
            } else {
                const combinedExpression = types.arrayExpression([path.node.consequent, path.node.alternate])
                path.replaceWith(combinedExpression)
            }
        },
        LogicalExpression(path) {
            path.replaceWith(path.node.right)
        }
    })

    return generate(ast).code
}
