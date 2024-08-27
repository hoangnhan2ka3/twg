import { type ClassValue, type TWGOptions } from "src/index"

interface ParserOptions extends TWGOptions {
    flatten?: boolean
}

/**
 * Focusing on handling arrays and objects, looping them until all are flattened.
 * @param args The inputs class values
 * @param separator The separator used to join the classes
 * @returns string[]
 */
function reducer(args: ClassValue[], options?: ParserOptions) {
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

/**
 * Transforms the inputs. Map key to each values inside the Object zones.
 * @param options see [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#twg-options).
 * @param args The inputs class values
 * @returns string
 */
export function parser(options?: ParserOptions) {
    const divider = (options?.separator !== undefined) ? typeof options.separator === "string" ? options.separator : "" : ":"

    return new Proxy((...args: ClassValue[]) => {
        return reducer(args, options).join(" ")
    }, {
        get: function (obj, key: string) {
            return key ? (...args: ClassValue[]) => {
                const filteredValues = reducer(args, options).filter(values => values.trim() !== "")
                if (options?.flatten && filteredValues.length <= 1 && filteredValues[0] === "1") return key
                return filteredValues.map((values) => `${key}${divider}${values}`.trim())
            } : obj
        }
    }) as Record<string, (...args: ClassValue[]) => string> & ((...args: ClassValue[]) => string)
}
