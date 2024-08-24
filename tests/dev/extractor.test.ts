import { extractor } from "src/processor/extractor"

describe("extractOuterObjects()", () => {
    describe("General cases:", () => {
        it.each([
            {
                contents: `
                    <div className={twg("multiple classes"))} />
                `,
                expected: []
            },
            {
                contents: `
                    <div className={twg({
                        mod1: ["class", "other classes"],
                        mod2: ["multiple classes"]
                    })} />
                `,
                expected: [`{ mod1: ["class", "other classes"], mod2: ["multiple classes"] }`]
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["multiple classes"]
                        }
                    )} />
                `,
                expected: [`{ mod1: ["class", "other classes"], mod2: ["multiple classes"] }`]
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `,
                expected: [`{ mod1: ["class", "other classes"], mod2: ["class", { "additional-mod": "other classes" }] }`]
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: \`multiple
                            classes\`,
                            var2: [
                            "multiple classes", {
                                var3: \`other
                                class\`
                            }]
                        },
                        className
                    )} />
                `,
                expected: ["{ var1: `multiple classes`, var2: [ \"multiple classes\", { var3: `other class` }] }"]
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(extractor(contents.replace(/\s\s+/g, " "))).toStrictEqual(expected)
        })
    })

    describe("Multiple callee functions:", () => {
        it.each([
            {
                contents: `
                    <div className={cn({
                        mod1: ["class", "other classes"],
                        mod2: ["multiple classes"]
                    })} />
                    Hello World
                    <div className={cn(
                        "multiple classes",
                        {
                            mod3: ["class", "other multiple classes"],
                            mod4: ["multiple classes"]
                        }
                    )} />
                `,
                expected: [
                    `{ mod1: ["class", "other classes"], mod2: ["multiple classes"] }`,
                    `{ mod3: ["class", "other multiple classes"], mod4: ["multiple classes"] }`
                ]
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(extractor(contents.replace(/\s\s+/g, " "), "cn")).toStrictEqual(expected)
        })
    })
})
