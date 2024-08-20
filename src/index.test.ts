/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-constant-binary-expression */

import { twg } from "src"

describe("twg()", () => {
    describe("General cases:", () => {
        it.each([
            // --- General cases
            { args: [], expected: "" },
            { args: [""], expected: "" },
            { args: ["t"], expected: "t" },
            { args: ["1"], expected: "1" },
            { args: ["."], expected: "." },
            { args: [null], expected: "" },
            { args: [undefined], expected: "" },
            { args: [null, undefined], expected: "" },
            { args: ["class"], expected: "class" },
            { args: ["Class"], expected: "Class" },
            { args: ["multiple classes"], expected: "multiple classes" },
            { args: ["Multiple classes"], expected: "Multiple classes" },
            { args: ["multiple Classes"], expected: "multiple Classes" },
            {
                args: [["multiple classes", "in", "one array"]],
                expected: "multiple classes in one array"
            },
            {
                args: [["multiple classes"], ["in"], ["multiples array"]],
                expected: "multiple classes in multiples array"
            },
            {
                args: [
                    "multiple classes",
                    [true && "in", true && "array", false && "never"]
                ],
                expected: "multiple classes in array"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    // Only for testing, not for real usage because replacer() cannot handle remote classes
    describe("Remote classes:", () => {
        const remoteSingleClass = ["class"]
        const remoteMultipleClasses = ["multiple classes"]
        const remoteMultipleClassesWithVar = ["multiple classes", { var: "class" }]
        const remoteMultipleClassesWithMultipleVars = [
            "multiple classes", { var: "class" }, { var: "multiple classes" }
        ]
        const remoteMultipleClassesWithObjectOnly = [{ var: "multiple classes" }]
        const remoteMultipleClassesAndVarsWithObjectOnly = [
            { var1: "multiple classes", var2: ["class", { var3: "multiple classes" }] }
        ]

        it.each([
            { args: remoteSingleClass, expected: "class" },
            { args: remoteMultipleClasses, expected: "multiple classes" },
            { args: remoteMultipleClassesWithVar, expected: "multiple classes var:class" },
            {
                args: remoteMultipleClassesWithMultipleVars,
                expected: "multiple classes var:class var:multiple var:classes"
            },
            { args: remoteMultipleClassesWithObjectOnly, expected: "var:multiple var:classes" },
            {
                args: remoteMultipleClassesAndVarsWithObjectOnly,
                expected: "var1:multiple var1:classes var2:class var2:var3:multiple var2:var3:classes"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Object only:", () => {
        it.each([
            {
                args: [{ var: "class" }],
                expected: "var:class"
            },
            {
                args: [{ var: "multiple classes with var" }],
                expected: "var:multiple var:classes var:with var:var"
            },
            {
                args: [{ var1: ["multiple classes", { var2: "in array with var" }] }],
                expected: "var1:multiple var1:classes var1:var2:in var1:var2:array var1:var2:with var1:var2:var"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Object last:", () => {
        it.each([
            {
                args: ["multiple classes", { var: "class" }],
                expected: "multiple classes var:class"
            },
            {
                args: ["multiple classes", { var: "multiple classes with var" }],
                expected: "multiple classes var:multiple var:classes var:with var:var"
            },
            {
                args: ["multiple classes", { var: ["multiple classes", "in array with var"] }],
                expected: "multiple classes var:multiple var:classes var:in var:array var:with var:var"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Object center:", () => {
        it.each([
            {
                args: [{ var: "class" }, "multiple classes"],
                expected: "var:class multiple classes"
            },
            {
                args: [{ var: "multiple classes with var" }, "multiple classes"],
                expected: "var:multiple var:classes var:with var:var multiple classes"
            },
            {
                args: [{ var: ["multiple classes", "in array with var"] }, "multiple classes"],
                expected: "var:multiple var:classes var:in var:array var:with var:var multiple classes"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Object first:", () => {
        it.each([
            {
                args: ["multiple classes", { var: "class" }, "class"],
                expected: "multiple classes var:class class"
            },
            {
                args: ["multiple classes", { var: "multiple classes with var" }, "and behind-object class"],
                expected: "multiple classes var:multiple var:classes var:with var:var and behind-object class"
            },
            {
                args: ["multiple classes", { var: ["multiple classes", "in array with var"] }, "and behind-object class"],
                expected: "multiple classes var:multiple var:classes var:in var:array var:with var:var and behind-object class"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Object first with doubled-quoted vars:", () => {
        it.each([
            {
                args: [{ "doubled-quoted-var": "class" }, "multiple classes"],
                expected: "doubled-quoted-var:class multiple classes"
            },
            {
                args: [{ "doubled-quoted-var": "multiple classes with var" }, "multiple classes"],
                expected: "doubled-quoted-var:multiple doubled-quoted-var:classes doubled-quoted-var:with doubled-quoted-var:var multiple classes"
            },
            {
                args: [{ "doubled-quoted-var": ["multiple classes", "in array with var"] }, "multiple classes"],
                expected: "doubled-quoted-var:multiple doubled-quoted-var:classes doubled-quoted-var:in doubled-quoted-var:array doubled-quoted-var:with doubled-quoted-var:var multiple classes"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Object last with doubled-quoted vars:", () => {
        it.each([
            {
                args: ["multiple classes", { "doubled-quoted-var": "class" }],
                expected: "multiple classes doubled-quoted-var:class"
            },
            {
                args: ["multiple classes", { "doubled-quoted-var": "multiple classes with var" }],
                expected: "multiple classes doubled-quoted-var:multiple doubled-quoted-var:classes doubled-quoted-var:with doubled-quoted-var:var"
            },
            {
                args: ["multiple classes", { "doubled-quoted-var": ["multiple classes", "in array with var"] }],
                expected: "multiple classes doubled-quoted-var:multiple doubled-quoted-var:classes doubled-quoted-var:in doubled-quoted-var:array doubled-quoted-var:with doubled-quoted-var:var"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Object center with doubled-quoted vars:", () => {
        it.each([
            {
                args: ["multiple classes", { "doubled-quoted-var": "class" }, "class"],
                expected: "multiple classes doubled-quoted-var:class class"
            },
            {
                args: ["multiple classes", { "doubled-quoted-var": "multiple classes with var" }, "and behind-object class"],
                expected: "multiple classes doubled-quoted-var:multiple doubled-quoted-var:classes doubled-quoted-var:with doubled-quoted-var:var and behind-object class"
            },
            {
                args: ["multiple classes", { "doubled-quoted-var": ["multiple classes", "in array with var"] }, "and behind-object class"],
                expected: "multiple classes doubled-quoted-var:multiple doubled-quoted-var:classes doubled-quoted-var:in doubled-quoted-var:array doubled-quoted-var:with doubled-quoted-var:var and behind-object class"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Object with multiple vars and arrays inside:", () => {
        it.each([
            {
                args: [
                    "multiple vars",
                    {
                        "": "class", //*
                        var1: ["class"],
                        var2: ["class", "other classes"],
                        var3: ["class", { "var4": "other classes" }]
                    }
                ],
                expected: "multiple vars class var1:class var2:class var2:other var2:classes var3:class var3:var4:other var3:var4:classes"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Multiple outer objects:", () => {
        it.each([
            {
                args: ["multiple classes", { var1: "class" }, { var2: "multiple classes" }],
                expected: "multiple classes var1:class var2:multiple var2:classes"
            },
            {
                args: ["multiple classes", { var1: "class" }, "wanna join in", { var2: "multiple classes" }],
                expected: "multiple classes var1:class wanna join in var2:multiple var2:classes"
            },
            {
                args: ["multiple classes", { var1: "class" }, { var2: "multiple classes" }, { var3: "class" }],
                expected: "multiple classes var1:class var2:multiple var2:classes var3:class"
            },
            {
                args: ["multiple classes", { var1: "class" }, "wanna join in", { var2: "multiple classes" }, { var3: "class" }],
                expected: "multiple classes var1:class wanna join in var2:multiple var2:classes var3:class"
            },
            {
                args: ["multiple classes", { var1: "class" }, { var2: "multiple classes" }, "wanna join in", { var3: "class" }, "yes i am in"],
                expected: "multiple classes var1:class var2:multiple var2:classes wanna join in var3:class yes i am in"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Multiple outer objects with duplicates vars (and utils):", () => {
        it.each([
            {
                args: ["multiple classes", { var: "class" }, { var: "class" }], //*
                expected: "multiple classes var:class var:class"
            },
            {
                args: ["multiple classes", { "var": "class" }, { var: "class" }], //*
                expected: "multiple classes var:class var:class"
            },
            {
                args: ["multiple classes", { var: "class-1" }, { var: "class-2" }], //*
                expected: "multiple classes var:class-1 var:class-2"
            },
            {
                args: ["multiple classes", { var: "class-1" }, { "var": "class-2" }, { var: "class-3" }], //*
                expected: "multiple classes var:class-1 var:class-2 var:class-3"
            },
            {
                args: ["multiple classes", { var: "class" }, { var: "multiple classes" }],
                expected: "multiple classes var:class var:multiple var:classes"
            },
            {
                args: ["multiple classes", { var: "class" }, "wanna join in", { var: "multiple classes" }],
                expected: "multiple classes var:class wanna join in var:multiple var:classes"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    describe("Array cases:", () => {
        it.each([
            // --- Array inside array only
            {
                args: [
                    "multiple classes",
                    ["within", "one single array"],
                    ["And within a", "array inside", ["other", "array"]]
                ],
                expected: "multiple classes within one single array And within a array inside other array"
            },
            // --- Multiple arrays inside each inside object
            {
                args: [
                    {
                        var1: [
                            "class",
                            "inside object and one var",
                            ["and within", "one single array"],
                            ["And within a", "array inside", ["other", "array"]]
                        ]
                    }
                ],
                expected: "var1:class var1:inside var1:object var1:and var1:one var1:var var1:and var1:within var1:one var1:single var1:array var1:And var1:within var1:a var1:array var1:inside var1:other var1:array"
            }
        ])('"$expected"', ({ args, expected }) => {
            expect(twg(...args)).toBe(expected)
        })
    })

    /**
     * @borrows https://github.com/Noriller/easy-tailwind/blob/master/src/index.spec.ts#L80C3-L120C6
     */
    describe("Complex cases:", () => {
        /* cSpell:disable */
        it("Handles a really complex object:", () => {
            expect(
                twg(
                    "Lorem ipsum",
                    "dolor sit",
                    ["amet", "consectetur adipiscing elit"],
                    ["Sed sit", "amet ligula", ["ex", "Ut"]],
                    {
                        var1: "in suscipit metus",
                        var2: [
                            "vel accumsan",
                            "orci",
                            ["Vivamus sapien", "neque", ["dictum vel", "felis maximus"]]
                        ],
                        var3: ["luctus", { var4: "lorem" }],
                        var5: [
                            "Fusce malesuada massa",
                            ["eu turpis finibus"],
                            {
                                var6: [
                                    "mollis",
                                    {
                                        var7: [
                                            "In augue tortor",
                                            {
                                                var8: [
                                                    "porta eu erat sit amet",
                                                    ["tristique", "ullamcorper", "arcu"]
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                )
            ).toBe(
                "Lorem ipsum dolor sit amet consectetur adipiscing elit Sed sit amet ligula ex Ut var1:in var1:suscipit var1:metus var2:vel var2:accumsan var2:orci var2:Vivamus var2:sapien var2:neque var2:dictum var2:vel var2:felis var2:maximus var3:luctus var3:var4:lorem var5:Fusce var5:malesuada var5:massa var5:eu var5:turpis var5:finibus var5:var6:mollis var5:var6:var7:In var5:var6:var7:augue var5:var6:var7:tortor var5:var6:var7:var8:porta var5:var6:var7:var8:eu var5:var6:var7:var8:erat var5:var6:var7:var8:sit var5:var6:var7:var8:amet var5:var6:var7:var8:tristique var5:var6:var7:var8:ullamcorper var5:var6:var7:var8:arcu"
            )
        })

        /* cSpell:enable */
    })

    /**
     * @borrows https://github.com/Noriller/easy-tailwind/blob/master/src/index.spec.ts#L122C3-L127C5
     */
    describe("Falsy cases:", () => {
        it.each([false && "anything", undefined && "anything", null && "anything"])(
            "Handles falsy values",
            (falsy) => {
                expect(twg(falsy)).toBe("")
            }
        )
    })
})