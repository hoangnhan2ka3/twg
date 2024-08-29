import generate from "@babel/generator"
import * as barser from "@babel/parser"
import traverse from "@babel/traverse"
import * as types from "@babel/types"
import { type ClassValue } from "src"
import { type ReplacerOptions } from "src/replacer"

import { parser } from "./parser"

/**
 * Use AST to transform the conditionals, especially the `nesting` Object conditionals or `nesting` kinds of ternary conditionals.
 * @param code input as string
 * @returns string
 */
export function transformer(
    code: string,
    options: ReplacerOptions
) {
    const ast = barser.parse(code, {
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
                                // 2. Find outer Object(s) inside callee function
                                if (!path.findParent((parentPath) => parentPath.isObjectExpression())) {
                                    // 3. First parse ternary and logical conditionals
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

                                    // 4. And parse the values if it is conditional
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

                                    // 5. Then take the outer Object(s) out
                                    const largestObject = generate(path.node).code

                                    // DONE. Final replace the original outer Object(s) with parsed one
                                    path.replaceWith(types.stringLiteral(
                                        parser(options)(...new Function(
                                            `return [${(/['"`]|:\s*1/g).test(largestObject) ? largestObject : ""}]`
                                        )() as ClassValue[])
                                    ))
                                }
                            } catch (e) {
                                options.debug && console.warn(`\n⚠️ TWG - Problem occurred on \`replacer()\`, please read the docs carefully:\n${((e as Error).message)} in:\n${generate(path.node).code}`)
                                return code
                            }
                        }
                    })
                }
            }
        })
    })

    return generate(ast).code
}
