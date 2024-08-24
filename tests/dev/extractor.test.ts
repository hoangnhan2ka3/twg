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
})
