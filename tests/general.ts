import { type ClassValue, twg } from "src/index"
import { replacer } from "src/replacer"
// import { extractOuterObjects } from "src/replacer/extractors"
import { createTwg } from "src/twg"

const content = /* js */ `
    <ContextMenuPrimitive.SubContent
        loop
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        ref={ref}
        className={twg(
            // "shadow-md shadow-mega-background/40",
            "z-[9999999992] min-w-32 transition-transform duration-350 ease-vaul",
            {
                "data-state=closed": "duration-350 animate-out fade-out-0 slide-out-to-top-full"
            },
            className
        )}
        {...props}
    >
        <Squircle
            directly
            cornerRadius={14}
            borderWidth={1.25}
            className={twg(
                "bg-mega-secondary/15 p-1",
                {
                    before: "bg-mega-tertiary"
                }
            )}
        >
            {children}
        </Squircle>
    </ContextMenuPrimitive.SubContent>
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

// function cn(...inputs: ClassValue[]) {
//     return twg({
//         separator: "h"
//     })(...inputs)
// }

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
// console.log("4: ", extractOuterObjects(content4))
