import { type ClassValue, type TWGOptions } from "src/index"

/**
 * Focusing on handling arrays and objects, looping them until all are flattened.
 * @param {ClassValue[]} args The inputs class values.
 * @param {TWGOptions} [options = {separator=":"}] separator. See [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#twg-options).
 * @returns string[]
 */
function reducer(args: ClassValue[], options?: TWGOptions) {
    return args.reduce<string[]>((acc, cur) => {
        if (!cur) return acc
        if (typeof cur === "object") {
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
 * @param {TWGOptions} [options = {separator=":"}] separator. See [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#twg-options).
 * @param {ClassValue[]} args The inputs class values.
 * @returns string
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
            ) => reducer(args, options).filter(values => values.trim() !== "").map(
                (values) => (values === "1" ? key : `${key}${divider}${values}`.trim())
            ) : obj
        }
    }) as Record<string, (...args: ClassValue[]) => string> & ((...args: ClassValue[]) => string)
}
