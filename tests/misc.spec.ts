import { type ClassValue, twg } from "src/index"
import { extractor } from "src/processor/extractor"
import { parser } from "src/processor/parser"
import { replacer } from "src/replacer"

const content = `
    <div className={twg(
        "multiple classes",
        {
            var: [
                "multiple classes",
                \`any \${!(!(!directly) && (borderWidth)) ? "other" : "class"}\`
            ]
        },
        className
    )} />
     <div className={twg(
        "multiple classes",
        {
            var: [
                "multiple classes",
                \`any \${!(!(!directly) && (borderWidth)) ? "other" : "class"}\`
            ]
        },
        className
    )} />
` as string

const transformedContent = replacer()(content)

console.log("1: ", transformedContent)

const content5 = `
{
            mod1: ["base", "other classes"],
            mod2: ["base", { "additional-mod": "other classes" }]
        }
{
            mod1: ["class", "other classes"],
            mod2: ["class", { "additional-mod": "other classes" }]
        }
`

// console.log("5: ", content5.slice(-1, 122 + 1))

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