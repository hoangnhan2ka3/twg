import { type ClassValue } from "src/lite"

export function parser() {
    function reducer(args: ClassValue[]): string[] {
        return args.reduce<string[]>((acc, cur) => {
            if (cur && typeof cur === "object") {
                Object.entries(cur).forEach(([key, values]) => {
                    (Array.isArray(values) ? values.flat(Infinity) : [values]).forEach(
                        value => acc.push(
                            (parser()[key] as (...args: ClassValue[]) => string)(value as ClassValue)
                        )
                    )
                })
            } else {
                acc.push(...String(cur).split(" "))
            }
            return acc
        }, []).flat()
    }

    return new Proxy((...args: ClassValue[]) => {
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
}
