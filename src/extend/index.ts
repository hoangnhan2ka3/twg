import { parser } from "src/extend/processor/parser"

export type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>

export interface TWGOptions {
    /**
     * The divider between the key and class values.
     * @default ":"
     * @see {@link https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#-custom-separator}
     */
    separator?: string | false
}

/**
 * Handles several types of class values including string, number, object, array, conditionals and also itself.
 * @param {ClassValue} mix The inputs class values.
 * @param {TWGOptions} [options = {separator=":"}] separator. See [docs](https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#twg-options).
 * @returns {string} `string`
 * @author lukeed <[reference](https://github.com/lukeed/clsx/blob/master/src/index.js#L1C1-L28C2)>
 */
function toVal(mix: ClassValue, options?: TWGOptions): string {
    let k = 0,
        i = false,
        y: string,
        str = ""
    if (typeof mix === "string" || typeof mix === "number") {
        str += String(mix)
    } else if (typeof mix === "object" && mix !== null) {
        if (Array.isArray(mix)) {
            const len = mix.length
            for (; k < len; k++) {
                if (mix[k]) {
                    y = toVal(mix[k] as ClassValue, options)
                    if (y) {
                        str && (str += " ")
                        str += y
                    }
                }
            }
        } else {
            for (y in mix) {
                if (mix[y] && typeof mix[y] !== "string" && !Array.isArray(mix[y])) {
                    str && (str += " ")
                    str += y
                } else {
                    i = true
                }
            }

            if (i) {
                str && (str += " ")
                str += parser(options)(mix)
            }
        }
    }
    return str
}

/**
 * Main API to handle several types of class values including string, number, object, array, conditionals, map key to each values inside the Object zones.
 * @param {TWGOptions} options See [docs](https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#twg-options).
 * @param {...ClassValue[]} inputs The inputs class values.
 * @returns {string} `(...inputs: ClassValue[]) => string`
 * @author lukeed <[reference](https://github.com/lukeed/clsx/blob/master/src/index.js#L30C1-L41C2)>
 */
export function createTwg(options: TWGOptions = {}) {
    return (...inputs: ClassValue[]) => {
        let i = 0,
            tmp: ClassValue,
            x: string,
            str = ""
        const len = inputs.length
        for (; i < len; i++) {
            tmp = inputs[i]
            if (tmp) {
                x = toVal(tmp, options)
                if (x) {
                    str && (str += " ")
                    str += x
                }
            }
        }
        return str
    }
}

/**
 * Utility function for grouping TailwindCSS variants on build time, inside the Object zones.
 * @param {...ClassValue[]} inputs The inputs class values.
 * @returns {string} `string`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
export function twg(...inputs: ClassValue[]) {
    return createTwg({ separator: ":" })(...inputs)
}

export default { createTwg, twg }
