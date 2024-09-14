import { parser as liteParser } from "src/extend/lite/processor/ast"
import { parser } from "src/extend/processor/ast"

describe("parser()", () => {
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
                expected: `twg("multiple classes", isTernary1 === "anything" ? "var2:multiple var2:classes" : "var2:other var2:multiple var2:w-[(([[[[5px]]}}} var2:multiple var2:classes var2:another var2:class", className);`
            },
            {
                contents: `
                    twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? "multiple w-[5px]]]]" : "other multiple classes",
                            var2: conditional2 === "true" ? "other multiple classes" : "multiple classes"
                        },
                        className
                    )
                `,
                expected: `twg("multiple classes", "var1:multiple var1:w-[5px]]]] var1:other var1:multiple var1:classes var2:other var2:multiple var2:classes var2:multiple var2:classes", className);`
            },
            {
                contents: `
                    twg(
                        "multiple classes",
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
                    )
                `,
                expected: `twg("multiple classes", "var1:multiple var1:classes var1:var2:multiple var1:var2:classes var1:var2:multiple var1:var2:classes var1:var2:var3:multiple var1:var2:var3:classes var1:var2:var3:multiple var1:var2:var3:classes var1:var2:var3:var6:multiple var1:var2:var3:var6:classes var1:var2:var3:var7:multiple var1:var2:var3:var7:classes var1:var2:var3:var7:another var1:var2:var3:var7:class var1:var2:var3:var7:w-{{{ var1:var2:var3:var7:var9:multiple var1:var2:var3:var7:var9:classes var1:var2:var3:var7:var-10:multiple var1:var2:var3:var7:var-10:classes var1:var4:multiple var1:var4:classes var1:var4:multiple var1:var4:classes var1:var4:var5:multiple var1:var4:var5:classes var1:var4:var5:multiple var1:var4:var5:classes var1:var4:var5:another var1:var4:var5:class var1:var4:var5:var2:other var1:var4:var5:var2:multiple var1:var4:var5:var2:classes var1:var4:var5:var2:multiple var1:var4:var5:var2:classes var-4:multiple var-4:classes");`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(parser(contents, { callee: "twg", separator: ":" })).toBe(expected)
            expect(liteParser(contents, "twg")).toBe(expected)
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
                            var3: conditional3 === "foo" ? utilClass1 : utilClass2
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var2:multiple var2:classes var3", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? (utilClass1) : "other multiple classes",
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2,
                            var3: conditional3 === "foo" ? (utilClass1) : ((utilClass2))
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var2:multiple var2:classes var3", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? (utilClass1 ?? utilClass3()) : "other multiple classes",
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2 || utilClass3(),
                            var3: conditional3 === "foo" ? utilClass1() : utilClass2
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var2:multiple var2:classes var3", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(parser(contents, { callee: "twg", separator: ":" })).toBe(expected)
            expect(liteParser(contents, "twg")).toBe(expected)
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
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var2:multiple var2:classes var3", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? ((utilClass1())) : "other multiple classes",
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2(),
                            var3: conditional3 === "foo" ? (utilClass1()) : utilClass2()
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var2:multiple var2:classes var3", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(parser(contents, { callee: "twg", separator: ":" })).toBe(expected)
            expect(liteParser(contents, "twg")).toBe(expected)
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
                            var3: conditional3 === "foo" ? (utilClass1()) : utilClass2
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var1:class var2:multiple var2:classes var3", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? (utilClass1 || utilClass2) : (\`other multiple classes \${(!directly && borderWidth) ? "class" : ""}\`),
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2,
                            var3: conditional3 === "foo" ? \`lorem ipsum \${(!directly && borderWidth) ? "" : "class"}\` : \`other multiple class \${(!directly && borderWidth) ? "other" : "class"}\`
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var1:class var2:multiple var2:classes var3:lorem var3:ipsum var3:class var3:other var3:multiple var3:class var3:other var3:class", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? \`other multiple classes \${(!directly && borderWidth) ? "class" : ""}\` : utilClass1,
                            var2: conditional2 === "true" ? "multiple classes" : "avc",
                            var3: conditional3 === "foo" ? \`lorem ipsum \${(!directly && borderWidth) ? "" : "class"}\` : \`other multiple class \${(!directly && borderWidth) ? "other" : "class"}\`,
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var1:class var2:multiple var2:classes var2:avc var3:lorem var3:ipsum var3:class var3:other var3:multiple var3:class var3:other var3:class", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(parser(contents, { callee: "twg", separator: ":" })).toBe(expected)
            expect(liteParser(contents, "twg")).toBe(expected)
        })
    })

    describe("Special key:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? (utilClass1 ?? utilClass3()) : "other multiple classes",
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2 || utilClass3(),
                            [classes.menuOpen]: open
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var2:multiple var2:classes", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? (utilClass1 ?? utilClass3()) : "other multiple classes",
                            [classes.root]: true,
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2 || utilClass3(),
                            [classes.menuOpen]: open
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var2:multiple var2:classes", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? (utilClass1 ?? utilClass3()) : "other multiple classes",
                            [classes.root]: (isAndOr1 && isAndOr2),
                            var2: conditional2 === "true" ? "multiple classes" : utilClass2 || utilClass3(),
                            [classes.menuOpen]: "multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:other var1:multiple var1:classes var2:multiple var2:classes", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(parser(contents, { callee: "twg", separator: ":" })).toBe(expected)
            expect(liteParser(contents, "twg")).toBe(expected)
        })
    })
})
