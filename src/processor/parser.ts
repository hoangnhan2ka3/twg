import { type ClassValue, type TWGOptions } from "src/index"

/**
 * Focusing on handling arrays and objects, looping them until all are flattened.
 * @param args The inputs class values
 * @param separator The separator used to join the classes
 * @returns string[]
 * @author `easy-tailwind` [Noriller] see <[reference](https://github.com/Noriller/easy-tailwind/blob/master/src/index.ts#L65C1-L89C2)>
 */
function reducer(args: ClassValue[], options?: TWGOptions) {
    return (
        args.reduce<string[]>((acc: string[], cur: ClassValue) => {
            if (cur === undefined || cur === null || cur === false) return acc
            if (Array.isArray(cur)) {
                acc.push(...cur.filter(Boolean).map(String))
            } else if (typeof cur === "object") {
                Object.entries(cur).forEach(([key, values]) => {
                    const func = parser(options)[key] as (...args: ClassValue[]) => string
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
    ).flat()
}

/**
 * Transforms the inputs. Map key to each values inside the Object zones.
 * @param options see [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#twg-options).
 * @param args The inputs class values
 * @returns string
 * @author `easy-tailwind` [Noriller] see <[reference](https://github.com/Noriller/easy-tailwind/blob/master/src/index.ts#L57C1-L63C4)>
 */
export function parser(options?: TWGOptions) {
    const divider = (options?.separator !== undefined)
        ? typeof options.separator === "string"
            ? options.separator
            : ""
        : ":"
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

export default parser
