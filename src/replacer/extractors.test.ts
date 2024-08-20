import { extractOuterObjects } from "src/replacer/extractors"

describe("extractOuterObjects()", () => {
    describe("General cases:", () => {
        it.each([
            {
                contents: `
                    twg("multiple classes")
                `,
                expected: []
            },
            {
                contents: `
                    twg({
                        mod1: ["class", "other classes"],
                        mod2: ["multiple classes"]
                    })
                `,
                expected: [`{ mod1: ["class", "other classes"], mod2: ["multiple classes"] }`]
            },
            {
                contents: `
                    twg(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["multiple classes"]
                        }
                    )
                `,
                expected: [`{ mod1: ["class", "other classes"], mod2: ["multiple classes"] }`]
            },
            {
                contents: `
                    twg(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )
                `,
                expected: [`{ mod1: ["class", "other classes"], mod2: ["class", { "additional-mod": "other classes" }] }`]
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(extractOuterObjects(contents.replace(/\s\s+/g, " "))).toStrictEqual(expected)
        })
    })
})