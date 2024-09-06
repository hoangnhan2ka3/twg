import { type ClassValue, type TWGOptions } from "src/extend"

/**
 * Focusing on handling arrays and objects, looping them until all are flattened.
 * @param {ClassValue[]} args The inputs class values.
 * @param {TWGOptions} [options = {separator=":"}] separator. See [docs](https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#twg-options).
 * @returns {string[]} `string[]`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
function reducer(args: ClassValue[], options?: TWGOptions) {
    return args.reduce<string[]>((acc, cur) => {
        if (!cur) return acc
        if (typeof cur === "object") {
            for (const [key, values] of Object.entries(cur)) {
                (Array.isArray(values) ? values.flat(Infinity) : [values]).forEach(
                    value => acc.push(
                        (parser(options)[key] as (...args: ClassValue[]) => string)(value as ClassValue)
                    )
                )
            }
        } else {
            acc.push(...String(cur).split(" "))
        }
        return acc
    }, []).flat().filter(Boolean)
}

/**
 * Transforms the inputs. Map key to each values inside the Object zones.
 * @param {TWGOptions} [options = {separator=":"}] separator. See [docs](https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#twg-options).
 * @param {...ClassValue[]} args The inputs class values.
 * @returns {string} `Record<string, (...args: ClassValue[]) => string> & ((...args: ClassValue[]) => string)`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
export function parser(options?: TWGOptions) {
    return new Proxy((...args: ClassValue[]) => {
        return reducer(args, options).join(" ")
    }, {
        get: function (obj, key: string) {
            return key ? (
                ...args: ClassValue[]
            ) => reducer(args, options).map((values) => (
                values === "🚀" ? key : `${key}${options?.separator ? options.separator : ""}${values}`.trim()
            )) : obj
        }
    }) as Record<string, (...args: ClassValue[]) => string> & ((...args: ClassValue[]) => string)
}
