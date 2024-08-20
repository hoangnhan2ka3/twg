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
                expected: `
                    <div className={twg(
                        "multiple classes",
                        "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"
                    )} />
                `
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
                expected: `
                    <div className={twg(
                        "multiple classes",
                        "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"
                    )} />
                `
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
                expected: `
                    <div className={twg(
                        "multiple classes",
                        "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"
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
                            // comment low
                        }
                    )} />
                `,
                expected: `
                    <div className={twg(
                        "multiple classes",
                        "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"
                    )} />
                `
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
                expected: `
                    <div className={twg([
                        "multiple classes",
                        "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"
                    ])} />
                `
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
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
                expected: `
                    <div className={cn(
                        "multiple classes",
                        "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"
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
            expect(replacer({ callee: "cn" })(contents)).toBe(expected)
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
                        "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"
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
                        "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"
                    )} />
                `
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ callee: ["twg", "cn"] })(contents)).toBe(expected)
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
        })
    })

    // describe("Custom separator:", () => {
    //     it.each([
    //         {
    //             contents: `
    //                 <div className={twg(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `,
    //             expected: `
    //                 <div className={twg(
    //                     "multiple classes",
    //                     "mod1class mod1other mod1classes mod2class mod2additional-modother mod2additional-modclasses"
    //                 )} />
    //             `
    //         },
    //         {
    //             contents: `
    //                 <div className={cn(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `,
    //             expected: `
    //                 <div className={cn(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `
    //         }
    //     ])('"$expected"', ({ contents, expected }) => {
    //         expect(replacer({ separator: "" })(contents)).toBe(expected)
    //     })

    //     it.each([
    //         {
    //             contents: `
    //                 <div className={twg(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `,
    //             expected: `
    //                 <div className={twg(
    //                     "multiple classes",
    //                     "mod1-class mod1-other mod1-classes mod2-class mod2-additional-mod-other mod2-additional-mod-classes"
    //                 )} />
    //             `
    //         },
    //         {
    //             contents: `
    //                 <div className={cn(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `,
    //             expected: `
    //                 <div className={cn(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `
    //         }
    //     ])('"$expected"', ({ contents, expected }) => {
    //         expect(replacer({ separator: "-" })(contents)).toBe(expected)
    //     })

    //     it.each([
    //         {
    //             contents: `
    //                 <div className={twg(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `,
    //             expected: `
    //                 <div className={twg(
    //                     "multiple classes",
    //                     "mod1tclass mod1tother mod1tclasses mod2tclass mod2tadditional-modtother mod2tadditional-modtclasses"
    //                 )} />
    //             `
    //         },
    //         {
    //             contents: `
    //                 <div className={cn(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `,
    //             expected: `
    //                 <div className={cn(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `
    //         }
    //     ])('"$expected"', ({ contents, expected }) => {
    //         expect(replacer({ separator: "t" })(contents)).toBe(expected)
    //     })

    //     it.each([
    //         {
    //             contents: `
    //                 <div className={twg(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod:": "other classes" }],
    //                         "mod3-": "multiple classes"
    //                     }
    //                 )} />
    //             `,
    //             expected: `
    //                 <div className={twg(
    //                     "multiple classes",
    //                     "mod1class mod1other mod1classes mod2class mod2additional-mod:other mod2additional-mod:classes mod3-multiple mod3-classes"
    //                 )} />
    //             `
    //         },
    //         {
    //             contents: `
    //                 <div className={cn(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `,
    //             expected: `
    //                 <div className={cn(
    //                     "multiple classes",
    //                     {
    //                         mod1: ["class", "other classes"],
    //                         mod2: ["class", { "additional-mod": "other classes" }]
    //                     }
    //                 )} />
    //             `
    //         }
    //     ])('"$expected"', ({ contents, expected }) => {
    //         expect(replacer({ separator: false })(contents)).toBe(expected)
    //     })
    // })

    describe("Custom matchFunction regex:", () => {
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
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ matchFunction: /^cn$/ })(contents)).toBe(expected)
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
            expect(replacer({ matchFunction: "/^twg$/g" })(contents)).toBe(expected)
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
            expect(replacer({ matchFunction: "" })(contents)).toBe(expected)
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
            expect(replacer({ matchFunction: undefined })(contents)).toBe(expected)
        })
    })

    describe("More complex contents:", () => {
        it.each([
            {
                contents: `
                    <div className={cn([
                        "multiple classes",
                        {
                            // comments
                            mod1: ["base", "other classes"],
                            mod2: ["base", { "additional-mod": "other classes" }]
                        }
                    ])} />
                    Some contents
                    <div className={cn(
                        "multiple classes",
                        {
                            // comments
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `,
                expected: `
                    <div className={cn([
                        "multiple classes",
                        "mod1:base mod1:other mod1:classes mod2:base mod2:additional-mod:other mod2:additional-mod:classes"
                    ])} />
                    Some contents
                    <div className={cn(
                        "multiple classes",
                        "mod1:class mod1:other mod1:classes mod2:class mod2:additional-mod:other mod2:additional-mod:classes"
                    )} />
                `
            },
            {
                contents: `
                    <div className={twg([
                        "multiple classes",
                        {
                            // comments
                            mod1: ["base", "other classes"],
                            mod2: ["base", { "additional-mod": "other classes" }]
                        }
                    ])} />
                    Some contents
                    <div className={twg(
                        "multiple classes",
                        {
                            mod1: ["class", "other classes"],
                            mod2: ["class", { "additional-mod": "other classes" }]
                        }
                    )} />
                `,
                expected: `
                    <div className={twg([
                        "multiple classes",
                        {
                            // comments
                            mod1: ["base", "other classes"],
                            mod2: ["base", { "additional-mod": "other classes" }]
                        }
                    ])} />
                    Some contents
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
            expect(replacer({ callee: "cn" })(contents)).toBe(expected)
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
                expected: `
                    <div className={twg(
                        "multiple classes",
                        "var1:class",
                        "var2:multiple var2:classes",
                        className
                    )} />
                `
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
                expected: `
                    <div className={twg(
                        "multiple classes",
                        "var1:class",
                        "other multiple classes",
                        "var2:multiple var2:classes",
                        className
                    )} />
                `
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
        })
    })

    describe("Misleading object:", () => {
        it.each([
            {
                contents: "<div className={twg(badgeVariants({ variant }), className)} />",
                expected: `<div className={twg(badgeVariants(""), className)} />`
            },
            {
                contents: `<div className={twg(badgeVariants({ variant: "primary" }), className)} />`,
                expected: `<div className={twg(badgeVariants("variant:primary"), className)} />`
                // ignores Tailwind to scan variant:primary class, anyways it's not exist
            },
            {
                // const style = "primary"
                contents: "<div className={twg(badgeVariants({ variant: style }), className)} />",
                expected: `<div className={twg(badgeVariants(""), className)} />`
            },
            {
                contents: `<div className={twg("multiple classes", badgeVariants({ variant }), className)} />`,
                expected: `<div className={twg("multiple classes", badgeVariants(""), className)} />`
            },
            {
                contents: `<div className={twg("multiple classes", badgeVariants({ variant: "primary" }), className)} />`,
                expected: `<div className={twg("multiple classes", badgeVariants("variant:primary"), className)} />`
            },
            {
                contents: `
                    <div className={cn(
                        "flex w-full",
                        {
                            before: [
                                badgeVariants({ variant }),
                                {
                                    hover: "bg-red-500"
                                }
                            ]
                        },
                        className
                    )} />
                `,
                expected: `
                    <div className={cn(
                        "flex w-full",
                        {
                            before: [
                                badgeVariants({ variant }),
                                {
                                    hover: "bg-red-500"
                                }
                            ]
                        },
                        className
                    )} />
                `
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
        })
    })

    describe("Conditional classes:", () => {
        it.each([
            {
                contents: `
                    <div className={cn(
                        "multiple classes",
                        {
                            var: conditional && "multiple classes",
                        },
                        className
                    )} />
                `,
                expected: `
                    <div className={cn(
                        "multiple classes",
                        "var:multiple var:classes",
                        className
                    )} />
                `
            },
            { //*
                contents: `
                    <div className={cn(
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
                expected: `
                    <div className={cn(
                        "multiple classes",
                        "var1:multiple var1:classes var2:multiple var2:classes var2:var3:other var2:var3:class",
                        className
                    )} />
                `
            },
            {
                contents: `
                    <div className={cn(
                        "multiple classes",
                        {
                            var1: conditional1 ? "multiple classes" : "other multiple classes",
                            var2: conditional2 === "true" ? "multiple classes" : "other multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `
                    <div className={cn(
                        "multiple classes",
                        "var1:multiple var1:classes var1:other var1:multiple var1:classes var2:multiple var2:classes var2:other var2:multiple var2:classes",
                        className
                    )} />
                `
            },
            {
                contents: `
                    <div className={cn(
                        "multiple classes",
                        {
                            var1: conditional1 ? " multiple classes  " : "other    multiple  classes",
                            var2: conditional2 === "true" ? "multiple classes" : "other multiple classes"
                        },
                        className
                    )} />
                `,
                expected: `
                    <div className={cn(
                        "multiple classes",
                        "var1:multiple var1:classes var1:other var1:multiple var1:classes var2:multiple var2:classes var2:other var2:multiple var2:classes",
                        className
                    )} />
                `
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer({ callee: "cn" })(contents)).toBe(expected)
        })
    })

    describe("Empty & plain text contents:", () => {
        it.each([
            { contents: "", expected: "" },
            { contents: "anything", expected: "anything" }
        ])('"$expected"', ({ contents, expected }) => {
            expect(replacer()(contents)).toBe(expected)
        })
    })
})
