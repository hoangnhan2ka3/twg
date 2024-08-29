import { type ClassValue } from "src/lite"

function reducer(args: ClassValue[]) {
    return args.reduce<string[]>((acc, cur) => {
        if (!cur) return acc
        if (typeof cur === "object") {
            Object.entries(cur).forEach(([key, values]) => {
                (Array.isArray(values) ? values.flat(Infinity) : [values]).forEach(
                    value => acc.push(
                        (parser[key] as (...args: ClassValue[]) => string)(value as ClassValue)
                    )
                )
            })
        } else {
            acc.push(...String(cur).split(" "))
        }
        return acc
    }, []).flat()
}

export const parser = new Proxy((...args: ClassValue[]) => {
    return reducer(args).join(" ")
}, {
    get: function (obj, key: string) {
        return key ? (
            ...args: ClassValue[]
        ) => reducer(args).filter(values => values.trim() !== "").map((values) => (
            values === "1" ? key : `${key}:${values}`.trim()
        )) : obj
    }
}) as Record<string, (...args: ClassValue[]) => string> & ((...args: ClassValue[]) => string)
