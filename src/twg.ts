import { type ClassValue, type TWGOptions } from "src"

function reducer(args: ClassValue[], separator: string | false | undefined) {
    return (
        args.reduce<string[]>((acc: string[], cur: ClassValue) => {
            if (cur === undefined || cur === null || cur === false) return acc
            if (Array.isArray(cur)) {
                acc.push(...cur.filter(Boolean).map(String))
            } else if (typeof cur === "object") {
                Object.entries(cur).forEach(([key, values]) => {
                    const func = createTwg({ separator })[key] as (...args: ClassValue[]) => string
                    if (Array.isArray(values)) {
                        values.flat(Infinity).forEach((value: ClassValue) => {
                            acc.push(func(value))
                        })
                    } else {
                        acc.push(func(values as ClassValue))
                    }
                })
            } else {
                acc.push(...String(cur).split(" "))
            }
            return acc
        }, [])
    ).flat(Infinity)
}

function createTwg(options?: TWGOptions) {
    return new Proxy((...args: ClassValue[]) => {
        return reducer(args, options?.separator).join(" ")
    }, {
        get: function (obj, key: string) {
            const divider = (options?.separator !== undefined)
                ? typeof options.separator === "string"
                    ? options.separator
                    : ""
                : ":"
            return key ? (
                ...args: ClassValue[]
            ) => reducer(args, divider).map((values) => (
                `${key}${divider}${values}`
            )) : obj
        }
    }) as Record<string, (...args: ClassValue[]) => string> & ((...args: ClassValue[]) => string)
}

export { createTwg }
