import { parser } from "src/processor/parser"

export type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>

export interface TWGOptions {
    separator?: string | false
}

/**
 * Handles several types of class values including string, number, object, array, conditionals and also itself.
 * @param {ClassValue} mix The inputs class values.
 * @param {TWGOptions} [options = {separator=":"}] separator. See [docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#twg-options).
 * @returns string
 * @author `clsx` [Luke Edwards] see <[reference](https://github.com/lukeed/clsx/blob/master/src/index.js#L1C1-L28C2)>
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
 * Utility function to transform the inputs on build time. Map key to each values inside the Object zones.
 * @param {...(ClassValue | TWGOptions)[]} inputs The inputs class values and the last Object is the [options](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#twg-options).
 * @returns string
 * @author `clsx` [Luke Edwards] see <[reference](https://github.com/lukeed/clsx/blob/master/src/index.js#L30C1-L41C2)>
 */
export function twg(...inputs: (ClassValue | TWGOptions)[]) {
    let options: TWGOptions = { separator: ":" }
    const lastInput = inputs[inputs.length - 1]
    if (typeof lastInput === "object" && lastInput !== null && !Array.isArray(lastInput) && "separator" in lastInput) {
        options = lastInput as TWGOptions
        // Omit the last Object if it is the options
        inputs.pop()
    }

    let i = 0,
        tmp: ClassValue,
        x: string,
        str = ""
    const len = inputs.length
    for (; i < len; i++) {
        tmp = inputs[i] as ClassValue
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

export default twg
