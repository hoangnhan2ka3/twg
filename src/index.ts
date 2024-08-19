import { createTwg } from "src/twg"

type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>

/**
 * Handles several types of class values including string, number, object, array, conditionals and also itself.
 * @author `clsx` [Luke Edwards] see <[reference](https://github.com/lukeed/clsx/blob/master/src/index.js#L1C1-L28C2)>
 */
function toVal(mix: ClassValue, separator?: string | false): string {
    let k: number,
        y: string,
        str = ""
    // console.log(divider)
    if (typeof mix === "string" || typeof mix === "number") {
        str += mix.toString()
    } else if (typeof mix === "object" && mix !== null) {
        if (Array.isArray(mix)) {
            const len = mix.length
            for (k = 0; k < len; k++) {
                if (mix[k]) {
                    y = toVal(mix[k] as ClassValue, separator)
                    if (y) {
                        str && (str += " ")
                        str += y
                    }
                }
            }
        } else {
            str += createTwg({ separator })(mix)
        }
    }
    return str
}

interface TWGOptions {
    separator?: string | false
}

/**
 * Utility function to transform the inputs on build time. Map key to each values inside the Object zones.
 * @param options see [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#twg-options)
 * @param inputs The inputs class values
 * @author `clsx` [Luke Edwards] see <[reference](https://github.com/lukeed/clsx/blob/master/src/index.js#L30C1-L41C2)>
 */
function twg(...inputs: ClassValue[]) {
    let i = 0,
        tmp: ClassValue,
        x: string,
        str = ""
    const len = inputs.length
    for (; i < len; i++) {
        tmp = inputs[i]
        if (tmp) {
            x = toVal(tmp)
            if (x) {
                str && (str += " ")
                str += x
            }
        }
    }
    return str
}

export { type ClassValue, twg, type TWGOptions }
export default twg
