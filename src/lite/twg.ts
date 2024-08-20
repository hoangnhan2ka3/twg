import { type ClassValue } from "src/lite"

function reducer(args: ClassValue[]) {
    return (
        args.reduce<string[]>((acc: string[], cur: ClassValue) => {
            if (cur === undefined || cur === null || cur === false) return acc
            if (Array.isArray(cur)) {
                acc.push(...cur.filter(Boolean).map(String))
            } else if (typeof cur === "object") {
                Object.entries(cur).forEach(([key, values]) => {
                    const func = createTwg[key] as (...args: ClassValue[]) => string
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

export const createTwg = new Proxy((...args: ClassValue[]) => {
    return reducer(args).join(" ")
}, {
    get: function (obj, key: string) {
        return key ? (
            ...args: ClassValue[]
        ) => reducer(args).filter(values => values.trim() !== "").map((values) => (
            `${key}:${values}`.trim()
        )) : obj
    }
}) as Record<string, (...args: ClassValue[]) => string> & ((...args: ClassValue[]) => string)
