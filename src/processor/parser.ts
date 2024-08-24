import { type ClassValue, type TWGOptions } from "src/index"

/**
 * Focusing on handling arrays and objects, looping them until all are flattened.
 * @param args The inputs class values
 * @param separator The separator used to join the classes
 * @returns string[]
 */
function reducer(args: ClassValue[], options?: TWGOptions): string[] {
    return args.reduce<string[]>((acc, cur) => {
        if (cur && typeof cur === "object") {
            Object.entries(cur).forEach(([key, values]) => {
                (Array.isArray(values) ? values.flat(Infinity) : [values]).forEach(
                    value => acc.push(
                        (parser(options)[key] as (...args: ClassValue[]) => string)(value as ClassValue)
                    )
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
export function parser(options?: TWGOptions) {
    const divider = (options?.separator !== undefined) ? typeof options.separator === "string" ? options.separator : "" : ":"

    return new Proxy((...args: ClassValue[]) => {
        return reducer(args, options).join(" ")
    }, {
        get: function (obj, key: string) {
            return key ? (
                ...args: ClassValue[]
                // filter out empty strings/spaces
            ) => reducer(args, options).filter(values => values.trim() !== "").map((values) => (
                `${key}${divider}${values}`.trim()
            )) : obj
        }
    }) as Record<string, (...args: ClassValue[]) => string> & ((...args: ClassValue[]) => string)
}
