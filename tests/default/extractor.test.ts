import { extractor } from "src/processor/extractor"

describe("extractor()", () => {
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

    describe("Multiple callee functions:", () => {
        it.each([
            {
                contents: `
                    export default function ModeToggle() {
                        const { resolvedTheme, setTheme } = useTheme()
                        const [icon, setIcon] = useState<React.JSX.Element | null>(null)

                        const classVar = cn(
                            "size-5 duration-300 animate-in blur-in-md"
                        )

                        useEffect(() => {
                            setIcon(resolvedTheme === "dark"
                                ? <FaMoon size={20} className={classVar} />
                                : <MdSunny size={20} className={classVar} />
                            )
                        }, [classVar, resolvedTheme])

                        const nextTheme = resolvedTheme === "light" ? "dark" : "light"

                        useHotKeys(["m"], () => {
                            setTheme(nextTheme)
                        })

                        // const handleKeyDown = (e: KeyboardEvent) => {
                        //     /** @see https://stackoverflow.com/a/38241109 how to detect repeat key presses */
                        //     if (e.repeat) return
                        //     if ((e.key === "m" || e.key === "M") && (e.metaKey || e.ctrlKey)) {
                        //         setTheme(resolvedTheme === "light" ? "dark" : "light")
                        //     }
                        // }

                        return (
                            <Button square onClick={() => {
                                setTheme(nextTheme)
                                document.cookie = \`theme=\${nextTheme}\`
                            }}>
                                {icon}
                            </Button>
                        )
                    }
                `,
                expected: []
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(extractor(contents.replace(/\s\s+/g, " "))).toStrictEqual(expected)
        })
    })

    describe("Unbalanced brackets:", () => {
        it.each([
            {
                contents: `
                    <div className={twg(
                        "multiple classes",
                        {
                            var1: [
                                "multiple classes",
                                isTernary1 === "anything" ? {
                                    var2: "multiple classes w-{{{}}{"
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
                                                        isAndOr && "another class w-{{{{",
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
                        },
                        className
                    )} />
                `,
                expected: [
                    "{ var1: [ \"multiple classes\", isTernary1 === \"anything\" ? { var2: \"multiple classes w-{{{}}{\" } : { var2: [ \"multiple classes\", isTernary2 === \"anything\" ? { var3: \"multiple classes\" } : { var3: [ \"multiple classes\", isTernary5 === \"anything\" ? { var6: \"multiple classes\" } : { var7: [ \"multiple classes\", isAndOr && \"another class w-{{{{\", isTernary8 === \"anything\" ? { var9: \"multiple classes\" } : { \"var-10\": [\"multiple classes\"] } ] } ] } ] }, isTernary3 === \"anything\" ? { var4: \"multiple classes\" } : { var4: [ \"multiple classes\", isTernary4 === \"anything\" ? { var5: \"multiple classes\" } : { var5: [ \"multiple classes\", isAndOr && \"another class\", { var2: conditional2 === \"true\" ? \"other multiple classes\" : \"multiple classes\" } ], } ] } ], \"var-4\": \"multiple classes\" }"
                ]
            }
        ])('"$expected"', ({ contents, expected }) => {
            expect(extractor(contents.replace(/\s\s+/g, " "))).toStrictEqual(expected)
        })
    })
})
