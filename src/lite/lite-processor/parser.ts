import { type ClassValue } from "src/lite"

interface ParserLiteOptions {
    flatten?: boolean
}

function reducer(args: ClassValue[], options?: ParserLiteOptions): string[] {
    return args.reduce<string[]>((acc, cur) => {
        if (!cur) return acc
        if (typeof cur === "object") {
            Object.entries(cur).forEach(([key, values]) => {
                (Array.isArray(values) ? values.flat(Infinity) : [values]).forEach(
                    value => {
                        if (value && typeof value !== "string" && typeof value !== "object") return acc.push(key)
                        return acc.push((parser(options)[key] as (...args: ClassValue[]) => string)(value as ClassValue))
                    }
                )
            })
        } else {
            acc.push(...String(cur).split(" "))
        }
        return acc
    }, []).flat()
}

export function parser(options?: ParserLiteOptions) {
    return new Proxy((...args: ClassValue[]) => {
        return reducer(args, options).join(" ")
    }, {
        get: function (obj, key: string) {
            return key ? (...args: ClassValue[]) => {
                const filteredValues = reducer(args, options).filter(values => values.trim() !== "")
                if (options?.flatten && filteredValues.length <= 1 && filteredValues[0] === "1") return key
                return filteredValues.map((values) => `${key}:${values}`.trim())
            } : obj
        }
    }) as Record<string, (...args: ClassValue[]) => string> & ((...args: ClassValue[]) => string)
}
