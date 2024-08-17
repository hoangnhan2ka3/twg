import { createTwg } from "src/twg"

type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>

/**
 * @borrows https://github.com/lukeed/clsx
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

function twg(options?: TWGOptions) {
    return (...inputs: ClassValue[]) => {
        let i: number,
            tmp: ClassValue,
            x: string,
            str = ""
        const len = inputs.length
        for (i = 0; i < len; i++) {
            tmp = inputs[i]
            if (tmp) {
                x = toVal(tmp, options?.separator)
                if (x) {
                    str && (str += " ")
                    str += x
                }
            }
        }
        return str
    }
}

export { type ClassValue, createTwg, twg, type TWGOptions }
