import { type ClassValue, twg } from "src/index"
import { replacer } from "src/replacer"
import { extractOuterObjects } from "src/replacer/extractors"
import { createTwg } from "src/twg"

const content = `
    <div className={twg(
        "multiple classes",
        {
            var1: [
                "multiple classes",
                isTernary1 === "anything1" ? {
                    var2: "multiple classes"
                } : {
                    var2: [
                        "multiple classes",
                        isAndOr && "another class",
                        isTernary2 === "anything2" ? {
                            var3: [
                                "class",
                                isTernary3 === "anything3" ? {
                                    var4: "multiple classes"
                                } : {
                                    var4: ["multiple classes"]
                                }
                            ]
                        } : {
                            var3: ["multiple classes"]
                        }
                    ]
                }
            ],
            "var-5": "multiple classes"
        },
        className
    )} />
` as string

const transformedContent = replacer({ matchFunction: "" })(content)

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
// console.log("3: ", createTwg({ separator: "h" })(
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
