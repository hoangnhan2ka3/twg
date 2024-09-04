import { combiner } from "src/processor/combiner"

describe("combiner()", () => {
    describe("General cases:", () => {
        it.each([
            {
                contents: `
                    twg(
                        "multiple classes",
                        isTernary1 === "anything" ? {
                            var2: "multiple classes"
                        } : {
                            var2: isTernary2 ? [
                                "other multiple w-[(([[[[5px]]}}}"
                            ] : [
                                "multiple classes",
                                isAndOr && "another class",
                            ]
                        },
                        className
                    )
                `,
                expected: `
                    twg(
                        "multiple classes",[{
                            var2: "multiple classes"
                        }, {
                            var2:[[
                                "other multiple w-[(([[[[5px]]}}}"
                            ], [
                                "multiple classes","another class",
                            ]]
                        }],
                        className
                    )
                `
            },
            {
                contents: `
                    {
                        var1: conditional1 ? "multiple """w-[5px]]]]" : "other multiple classes",
                        var2: conditional2 === "true" ? "other multiple classes" : "multiple classes"
                    }
                `,
                expected: `
                    {
                        var1:["multiple ", "other multiple classes"],
                        var2:["other multiple classes", "multiple classes"]
                    }
                `
            },
            {
                contents: `
                    {
                        var1: [
                            "multiple classes",
                            isTernary1 === "anything" ? {
                                var2: "multiple classes"
                            } : {
                                var2: [
                                    "multiple classes",
                                    isTernary2 === "anything" ? {
                                        var3: "multiple classes"
                                    } : {
                                        var3: [
                                            "multiple classes",
                                            isTernary5 === "anything" ? {
                                                var6: "multiple classes"
                                            } : {
                                                var7: [
                                                    "multiple classes",
                                                    isAndOr && "another class w-{{{",
                                                    isTernary8 === "anything" ? {
                                                        var9: "multiple classes"
                                                    } : {
                                                        "var-10": ["multiple classes"]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            isTernary3 === "anything" ? {
                                var4: "multiple classes"
                            } : {
                                var4: [
                                    "multiple classes",
                                    isTernary4 === "anything" ? {
                                        var5: "multiple classes"
                                    } : {
                                        var5: [
                                            "multiple classes",
                                            isAndOr && "another class",
                                            {
                                                var2: conditional2 === "true" ? "other multiple classes" : "multiple classes"
                                            }
                                        ],
                                    }
                                ]
                            }
                        ],
                        "var-4": "multiple classes"
                    }
                `,
                expected: `
                    {
                        var1: [
                            "multiple classes",[{
                                var2: "multiple classes"
                            }, {
                                var2: [
                                    "multiple classes",[{
                                        var3: "multiple classes"
                                    }, {
                                        var3: [
                                            "multiple classes",[{
                                                var6: "multiple classes"
                                            }, {
                                                var7: [
                                                    "multiple classes","another class w-{{{",[{
                                                        var9: "multiple classes"
                                                    }, {
                                                        "var-10": ["multiple classes"]
                                                    }]
                                                ]
                                            }]
                                        ]
                                    }]
                                ]
                            }],[{
                                var4: "multiple classes"
                            }, {
                                var4: [
                                    "multiple classes",[{
                                        var5: "multiple classes"
                                    }, {
                                        var5: [
                                            "multiple classes","another class",
                                            {
                                                var2:["other multiple classes", "multiple classes"]
                                            }
                                        ],
                                    }]
                                ]
                            }]
                        ],
                        "var-4": "multiple classes"
                    }
                `
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(combiner(contents)).toStrictEqual(expected)
        })
    })

    describe("Identifiers:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? utilClass1 : "other multiple classes",
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2,
                            var3: conditional3 === "foo" ? utilClass1() : utilClass2
                        },
                        className
                    )} />
                `,
                expected: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1:"other multiple classes",
                            var2:"multiple classes",
                            var3:NaN
                        },
                        className
                    )} />
                `
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(combiner(contents)).toStrictEqual(expected)
        })
    })

    describe("CallExpressions:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? utilClass1() : "other multiple classes",
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2(),
                            var3: conditional3 === "foo" ? utilClass1() : utilClass2()
                        },
                        className
                    )} />
                `,
                expected: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1:"other multiple classes",
                            var2:"multiple classes",
                            var3:NaN
                        },
                        className
                    )} />
                `
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(combiner(contents)).toStrictEqual(expected)
        })
    })

    describe("TemplateLiteralExpressions:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? (utilClass1 || utilClass2) : \`other multiple classes \${(!directly && borderWidth) ? "class" : ""}\`,
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2,
                            var3: conditional3 === "foo" ? utilClass1() : utilClass2
                        },
                        className
                    )} />
                `,
                expected: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1:\`other multiple classes \${"class" + " " + ""}\`,
                            var2:"multiple classes",
                            var3:NaN
                        },
                        className
                    )} />
                `
            }
            // {
            //     contents: `
            //         <div className={twg(
            //             "multiple classes",
            //             {
            //                 var1: conditional1 ? \`other multiple classes \${(!directly && borderWidth) ? "class" : ""}\` : utilClass1,
            //                 var2: conditional2 === "true" ? "multiple classes" : "avc",
            //                 var3: conditional3 === "foo" ? \`lorem ipsum \${(!directly && borderWidth) ? "" : "class"}\` : \`other multiple class \${(!directly && borderWidth) ? "other" : "class"}\`,
            //             },
            //             className
            //         )} />
            //     `,
            //     expected: `
            //         <div className={twg(
            //             "multiple classes",
            //             {
            //                 var1: conditional1 ? \`other multiple classes \${(!directly && borderWidth) ? "class" : ""}\` : utilClass1,
            //                 var2: conditional2 === "true" ? "multiple classes" : "avc",
            //                 var3: conditional3 === "foo" ? \`lorem ipsum \${(!directly && borderWidth) ? "" : "class"}\` : \`other multiple class \${(!directly && borderWidth) ? "other" : "class"}\`,
            //             },
            //             className
            //         )} />
            //     `
            // }
        ])('"$expected"', ({ contents, expected }) => {
            expect(combiner(contents)).toStrictEqual(expected)
        })
    })
})
