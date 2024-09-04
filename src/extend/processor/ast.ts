import generate from "@babel/generator"
import * as barser from "@babel/parser"
import traverse, { type NodePath } from "@babel/traverse"
import * as types from "@babel/types"
import { type ClassValue } from "src/extend"
import { parser } from "src/extend/processor/parser"
import { type ReplacerOptions } from "src/extend/replacer"

/**
 * Check whether consequent or alternate of a ternary conditional is a binding identifier.
 * @param {NodePath<types.Expression>} path consequent or alternate path of a ternary conditional.
 * @returns `boolean`
 */
function isExceptionCondition(path: NodePath<types.Expression>) {
    return !(path.isStringLiteral() || path.isTemplateLiteral() || path.isArrayExpression() || path.isObjectExpression())
}

/**
 * Use AST to transform the conditionals, especially the `nesting` Object conditionals or `nesting` kinds of ternary conditionals.
 * @param {string} code input code.
 * @param {ReplacerOptions} options callee, nestingCallee, separator, debug. See [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-content#replacer-options).
 * @returns `string`
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
                        CallExpression(innerPath) {
                            const nestingCallees = typeof options.nestingCallee === "string" ? [options.nestingCallee] : options.nestingCallee ?? callees
                            nestingCallees.forEach((name) => {
                                if (innerPath.get("callee").isIdentifier({ name })) {
                                    innerPath.replaceWith(
                                        types.arrayExpression(innerPath.node.arguments as types.Expression[])
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
                                ) && !(innerPath.node.properties[0] as types.ObjectProperty).shorthand
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
                                                    : innerPath.findParent((parent) => parent.isTemplateLiteral()) ? [innerPath.node.consequent, types.stringLiteral(" "), innerPath.node.alternate].reduce((acc, current) => types.binaryExpression("+", acc, current))
                                                        : types.arrayExpression([innerPath.node.consequent, innerPath.node.alternate])
                                        )
                                    }
                                })

                                // 4. And parse the values if it is conditional
                                innerPath.traverse({
                                    ObjectProperty(innerPath) {
                                        if (
                                            !innerPath.node.shorthand
                                            && !types.isStringLiteral(innerPath.node.value)
                                            && !types.isArrayExpression(innerPath.node.value)
                                            && !types.isTemplateLiteral(innerPath.node.value)
                                        ) innerPath.node.value = types.stringLiteral("🚀")
                                    }
                                })

                                // 5. Then take the outer Object(s) out
                                const largestObject = generate(innerPath.node).code

                                try {
                                    // DONE. Final replace the original outer Object(s) with parsed one
                                    innerPath.replaceWith(types.stringLiteral(
                                        parser(options)(...new Function(
                                            `return [${largestObject}]`
                                        )() as ClassValue[])
                                    ))
                                } catch (e) {
                                    options.debug && console.warn(`\n⚠️ TWG - Problem occurred on \`replacer()\`, please read the \`Usage / Use cases\` section on the docs carefully:\n${((e as Error).message)} in:\n${largestObject}`)
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
