import { replacer as liteReplacer } from "src/lite/replacer"
import { replacer } from "src/replacer"

describe("replacer()", () => {
    describe("Default options:", () => {
        it.each([
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
                expected: `<div className={twg("multiple classes", "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes")} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            // comment high
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes")} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            // comment middle
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes")} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                            // comment low
                        }
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes")} />;`
            },
            {
                contents: `
                    <div className={twg([
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    ])} />
                `,
                expected: `<div className={twg(["multiple classes", "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"])} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("Custom callee:", () => {
        it.each([
            {
                contents: `
                    <div className={cn(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `,
                expected: `<div className={cn("multiple classes", "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes")} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ callee: "cn" })(contents)).toBe(expected)
            expect(liteReplacer({ callee: "cn" })(contents)).toBe(expected)
        })

        it.each([
            {
                contents: `
                    <div className={cn(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `,
                expected: `<div className={cn("multiple classes", "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes")} />;`
            },
            {
                contents: `
                    <div className={clsx(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `,
                expected: `<div className={clsx("multiple classes", "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes")} />;`
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
                expected: `<div className={twg("multiple classes", "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes")} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ callee: ["cn", "twg", "clsx"] })(contents)).toBe(expected)
            expect(liteReplacer({ callee: ["cn", "twg", "clsx"] })(contents)).toBe(expected)
        })

        it.each([
            {
                contents: `
                    <div className={cn(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `,
                expected: `
                    <div className={cn(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `
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
                expected: `
                    <div className={twg(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ callee: "" })(contents)).toBe(expected)
            expect(liteReplacer({ callee: "" })(contents)).toBe(expected)
        })
    })

    describe("Custom separator:", () => {
        it.each([
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
                expected: `<div className={twg("multiple classes", "mod1class mod1other mod1classes mod2class mod2additional-modother mod2additional-modclasses")} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ separator: "" })(contents)).toBe(expected)
        })

        it.each([
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
                expected: `<div className={twg("multiple classes", "mod1-class mod1-other mod1-classes mod2-class mod2-additional-mod-other mod2-additional-mod-classes")} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ separator: "-" })(contents)).toBe(expected)
        })

        it.each([
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
                expected: `<div className={twg("multiple classes", "mod1tclass mod1tother mod1tclasses mod2tclass mod2tadditional-modtother mod2tadditional-modtclasses")} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ separator: "t" })(contents)).toBe(expected)
        })

        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod:": "other classes" }],
                            "mod3-": "multiple classes",
                            "mod4:": ["class", { "additional_mod:": "other classes" }]
                        }
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "mod1class mod1other mod1classes mod2class mod2additional-mod:other mod2additional-mod:classes mod3-multiple mod3-classes mod4:class mod4:additional_mod:other mod4:additional_mod:classes")} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ separator: false })(contents)).toBe(expected)
        })
    })

    describe("Multiple outer objects:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: "class"
                        },
                        {
                            var2: "multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:class", "var2:multiple var2:classes", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: "class"
                        },
                        "other multiple classes",
                        {
                            var2: "multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:class", "other multiple classes", "var2:multiple var2:classes", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("Misleading object:", () => {
        it.each([
            {
                contents: "<div className={twg(badgeVariants({ variant }), className)} />",
                expected: `<div className={twg(badgeVariants(""), className)} />;`
            },
            {
                contents: `<div className={twg(badgeVariants({ variant: "primary" }), className)} />`,
                expected: `<div className={twg(badgeVariants("variant:primary"), className)} />;`
                // ignores Tailwind to scan variant:primary class, anyways it's not exist
            },
            {
                // const style = "primary"
                contents: "<div className={twg(badgeVariants({ variant: style }), className)} />",
                expected: `<div className={twg(badgeVariants(""), className)} />;`
            },
            {
                contents: `<div className={twg("multiple classes", badgeVariants({ variant }), className)} />`,
                expected: `<div className={twg("multiple classes", badgeVariants(""), className)} />;`
            },
            {
                contents: `<div className={twg("multiple classes", badgeVariants({ variant: "primary" }), className)} />`,
                expected: `<div className={twg("multiple classes", badgeVariants("variant:primary"), className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("Misleading template literal:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var: [
                                "multiple classes",
                                \`other \${(!directly && borderWidth) ? "class" : ""}\`
                            ]
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var:multiple var:classes var:other var:class", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var: [
                                "multiple classes",
                                \`other \${(!directly && borderWidth) ? "class" : "multiple classes"}\`
                            ]
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var:multiple var:classes var:other var:class var:multiple var:classes", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("Multiple lines classes:", () => {
        it.each([
            { //*
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
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var2:multiple var2:classes var2:var3:other var2:var3:class", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("Conditional classes:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 && "multiple classes",
                            var2: (conditional2) && "multiple classes",
                            var3: (conditional3) && ("multiple classes")
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var2:multiple var2:classes var3:multiple var3:classes", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? "multiple classes" : "other multiple classes",
                            var2: conditional2 === "true" ? "multiple classes" : "other multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:other var1:multiple var1:classes var2:multiple var2:classes var2:other var2:multiple var2:classes", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: (conditional1) ? ("multiple classes") : "other multiple classes",
                            var2: (conditional2 === "true") ? "multiple classes" : ("other multiple classes"),
                            var3: (conditional3 === "true") ? ("multiple classes") : ("other multiple classes")
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:other var1:multiple var1:classes var2:multiple var2:classes var2:other var2:multiple var2:classes var3:multiple var3:classes var3:other var3:multiple var3:classes", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: (conditional1) ? " multiple classes  " : "other    multiple  classes",
                            var2: conditional2 === "true" ? ("multiple    classes") : (("other multiple classes   "))
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:other var1:multiple var1:classes var2:multiple var2:classes var2:other var2:multiple var2:classes", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("Conditional classes with arrays:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: conditional1 ? "multiple classes" : [
                                "other multiple classes",
                                {
                                    var2: "multiple classes"
                                }
                            ],
                            var3: (conditional2) && "multiple classes",
                            var4: (conditional3) && ("multiple classes")
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:other var1:multiple var1:classes var1:var2:multiple var1:var2:classes var3:multiple var3:classes var4:multiple var4:classes", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("Key as classes and value as conditionals:", () => {
        it.each([
            {
                contents: `<div className={twg({ "class": isAndOr1 })} />`,
                expected: `<div className={twg("class")} />;`
            },
            {
                contents: `<div className={twg({ "class": isAndOr1() })} />`,
                expected: `<div className={twg("class")} />;`
            },
            {
                contents: `<div className={twg({ "class": isAndOr1.truthy })} />`,
                expected: `<div className={twg("class")} />;`
            },
            {
                contents: `<div className={twg({ "class": isAndOr1["false"] })} />`,
                expected: `<div className={twg("class")} />;`
            },
            {
                contents: `<div className={twg({ "multiple classes": isAndOr1() && isAndOr2 })} />`,
                expected: `<div className={twg("multiple classes")} />;`
            },
            {
                contents: `<div className={twg({ "multiple classes": isAndOr1 || isAndOr2() })} />`,
                expected: `<div className={twg("multiple classes")} />;`
            },
            {
                contents: `<div className={twg({ "multiple classes": false })} />`,
                expected: `<div className={twg("multiple classes")} />;`
            },
            {
                contents: `<div className={twg({ "class": false && true })} />`,
                expected: `<div className={twg("class")} />;`
            },
            {
                contents: `<div className={twg({ "class": undefined })} />`,
                expected: `<div className={twg("class")} />;`
            },
            {
                contents: `
                    <div className={twg(
                        {"multiple classes": isAndOr1() && isAndOr2 },
                        {"other class": isAndOr3 || isAndOr4() },
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "other class")} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("Multiple conditional classes:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: condition1 && !condition2 ? "multiple classes" : "other multiple classes",
                            var2: !((condition2 || condition3) && !condition4) ? "multiple classes" : "other multiple classes",
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:other var1:multiple var1:classes var2:multiple var2:classes var2:other var2:multiple var2:classes", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("And-or conditional objects:", () => {
        it.each([
            { // --- And-or condition of outer objects
                contents: `
                    <div className={twg(
                        "multiple classes",
                        isAndOr && {
                            var: [
                                "multiple classes",
                                isAndOr && "another class",
                            ]
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var:multiple var:classes var:another var:class", className)} />;`
            },
            { // --- And-or condition of multiple outer objects
                contents: `
                    <div className={twg(
                        "multiple classes",
                        isAndOr1 || {
                            var1: [
                                "multiple classes",
                                isAndOr && "another class",
                            ]
                        },
                        isAndOr2 ?? {
                            var2: [
                                "multiple classes",
                                isAndOr && "another class",
                            ]
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:another var1:class", "var2:multiple var2:classes var2:another var2:class", className)} />;`
            },
            { // --- And-or condition object inside outer objects
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: [
                                "multiple classes",
                                isAndOr && {
                                    var2: [
                                        "multiple classes",
                                        isAndOr && "another class",
                                    ]
                                }
                            ],
                            "var-3": "multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:var2:multiple var1:var2:classes var1:var2:another var1:var2:class var-3:multiple var-3:classes", className)} />;`
            },
            { // --- And-or condition object inside outer objects
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: [
                                "multiple classes",
                                isAndOr ? {
                                    var2: [
                                        "multiple classes",
                                        isAndOr && "another class",
                                    ]
                                } : "other class",
                            ],
                            "var-3": "multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:var2:multiple var1:var2:classes var1:var2:another var1:var2:class var1:other var1:class var-3:multiple var-3:classes", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: [
                                "multiple classes",
                                isAndOr ?? {
                                    var2: [
                                        "multiple classes",
                                        isAndOr && "another class",
                                    ]
                                }
                            ],
                            "var-3": "multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:var2:multiple var1:var2:classes var1:var2:another var1:var2:class var-3:multiple var-3:classes", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })

    describe("Ternary conditional objects:", () => {
        it.each([
            { // --- Ternary condition of outer objects
                contents: `
                    <div className={twg(
                        "multiple classes",
                        isTernary === "anything" ? {
                            var2: "multiple classes"
                        } : {
                            var2: [
                                "multiple classes",
                                isAndOr && "another class",
                            ]
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", ["var2:multiple var2:classes", "var2:multiple var2:classes var2:another var2:class"], className)} />;`
            },
            { // --- Ternary condition of multiple outer objects
                contents: `
                    <div className={twg(
                        "multiple classes",
                        isTernary === "anything" ? {
                            var2: "multiple classes"
                        } : {
                            var2: [
                                "multiple classes",
                                isAndOr && "another class",
                            ]
                        },
                        isTernary2 === "else" ? {
                            var2: "multiple classes"
                        } : {
                            var2: [
                                "multiple classes",
                                isAndOr2 && "another class",
                            ]
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", ["var2:multiple var2:classes", "var2:multiple var2:classes var2:another var2:class"], ["var2:multiple var2:classes", "var2:multiple var2:classes var2:another var2:class"], className)} />;`
            },
            { // --- Ternary condition object inside outer objects
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: [
                                "multiple classes",
                                isTernary === "anything" ? {
                                    var2: "multiple classes"
                                } : {
                                    var2: [
                                        "multiple classes",
                                        isAndOr && "another class",
                                    ]
                                }
                            ],
                            "var-3": "multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:var2:multiple var1:var2:classes var1:var2:multiple var1:var2:classes var1:var2:another var1:var2:class var-3:multiple var-3:classes", className)} />;`
            },
            { // --- Ternary condition object inside other ternary condition object inside outer objects
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: [
                                "multiple classes",
                                isTernary === "anything" ? {
                                    var2: "multiple classes"
                                } : {
                                    var2: [
                                        "multiple classes",
                                        isAndOr && "another class",
                                        isTernary === "anything" ? {
                                            var3: "multiple classes"
                                        } : {
                                            var3: ["multiple classes"]
                                        }
                                    ]
                                }
                            ],
                            "var-4": "multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:var2:multiple var1:var2:classes var1:var2:multiple var1:var2:classes var1:var2:another var1:var2:class var1:var2:var3:multiple var1:var2:var3:classes var1:var2:var3:multiple var1:var2:var3:classes var-4:multiple var-4:classes", className)} />;`
            },
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: [
                                "multiple classes",
                                isTernary === "anything" ? {
                                    var2: "multiple classes"
                                } : {
                                    var2: [
                                        "multiple classes",
                                        isAndOr && "another class",
                                        isTernary === "anything" ? {
                                            var3: [
                                                "class",
                                                isTernary === "anything" ? {
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
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:var2:multiple var1:var2:classes var1:var2:multiple var1:var2:classes var1:var2:another var1:var2:class var1:var2:var3:class var1:var2:var3:var4:multiple var1:var2:var3:var4:classes var1:var2:var3:var4:multiple var1:var2:var3:var4:classes var1:var2:var3:multiple var1:var2:var3:classes var-5:multiple var-5:classes", className)} />;`
            },
            {
                contents: `
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
                `,
                expected: `<div className={twg("multiple classes", "var1:multiple var1:classes var1:var2:multiple var1:var2:classes var1:var2:multiple var1:var2:classes var1:var2:another var1:var2:class var1:var2:var3:class var1:var2:var3:var4:multiple var1:var2:var3:var4:classes var1:var2:var3:var4:multiple var1:var2:var3:var4:classes var1:var2:var3:multiple var1:var2:var3:classes var-5:multiple var-5:classes", className)} />;`
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
            expect(liteReplacer()(contents)).toBe(expected)
        })
    })
})
