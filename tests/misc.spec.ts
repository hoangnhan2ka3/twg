import { type ClassValue, twg } from "src/index"
import { replacer as liteReplacer } from "src/lite/replacer"
import { extractor } from "src/processor/extractor"
import { parser } from "src/processor/parser"
import { replacer } from "src/replacer"

const content = `
    <div className={twg({ "class": isAndOr1 })} />
` as string

const transformedContent = liteReplacer()(content)

console.log("1: ", transformedContent)

const isAndOr = false
const content5 = [{ "class": isAndOr, var: "multiple classes" }]

// console.log("5: ", twg(...content5))

function cn(...inputs: ClassValue[]) {
    return twg(...inputs)
}

const content2 = [
    "multiple classes", { "var:": "class" }, { var: "multiple classes" }
] as string[]
// console.log("2: ", twg(content2, {
//     separator: false
// }))

const content3 = `
    "multiple classes", { "var:": "class" }, { var: "multiple classes" }
`
// console.log("3: ", parser({ separator: "h" })(
//     ...new Function(`return [${content3}]`)() as ClassValue[]
// ))

function minifyJs(input: string): string {
    return input
        .replace(/\s\s+/g, " ") // Delete multiple spaces
        .replace(/\s*([{};:])\s*/g, "$1") // Delete spaces around $1
}

const content4 = `
    cn(
        directly
            ? borderWidth && baseSquircle
            : !borderWidth ? baseSquircle : cn(baseSquircle, {
                after: "absolute inset-0 block"
            }),
        propClassName
    )
`

// const content6 = `
//     twg(
//         "multiple classes",
//         "multiple classes",
//         {
//             var1: "class"
//         },
//         {
//             var2: "multiple classes"
//         },
//         className
//     )
// `
// console.log("4: ", extractOuterObjects(content6)[1])

// ConditionalExpression(path) {
//     if (path.findParent((parent) => parent.isTemplateLiteral())) {
//         const templateLiteral = types.templateLiteral(
//             [
//                 types.templateElement({ raw: "" }, true),
//                 types.templateElement({ raw: "" }, false),
//                 types.templateElement({ raw: "" }, true)
//             ],
//             [path.node.consequent, path.node.alternate]
//         )

//         path.replaceWith(templateLiteral)
//     } else {
//         const combinedExpression = types.arrayExpression([path.node.consequent, path.node.alternate])
//         path.replaceWith(combinedExpression)
//     }
// }
