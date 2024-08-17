import { type ClassValue, twg } from "src/index"
import { replacer } from "src/replacer"
import { extractArgumentsIndex, extractOuterObjects } from "src/replacer/extractors"
import { createTwg } from "src/twg"

const content = /* js */ `
    <div className={twg([
        "multiple classes",
        {
            mod1: ["base", "other classes"],
            mod2: ["base", { "additional-mod": "other classes" }]
        }
    ])} />
` as string

const transformedContent = replacer()(content)

// console.log("1: ", transformedContent)

function cn(...inputs: ClassValue[]) {
    return twg({
        separator: "h"
    })(...inputs)
}

const content2 = [
    "multiple classes", { "var:": "class" }, { var: "multiple classes" }
] as string[]
// console.log("2: ", cn(content2))

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
console.log("4: ", extractOuterObjects(content4))
