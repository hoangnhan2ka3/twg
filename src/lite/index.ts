import { type ClassValue } from "src/index"
import { createTwg } from "src/lite/twg"

function toVal(mix: ClassValue): string {
    let k: number,
        y: string,
        str = ""
    if (typeof mix === "string" || typeof mix === "number") {
        str += mix.toString()
    } else if (typeof mix === "object" && mix !== null) {
        if (Array.isArray(mix)) {
            const len = mix.length
            for (k = 0; k < len; k++) {
                if (mix[k]) {
                    y = toVal(mix[k] as ClassValue)
                    if (y) {
                        str && (str += " ")
                        str += y
                    }
                }
            }
        } else {
            str += createTwg(mix)
        }
    }
    return str
}

export function twg(...inputs: ClassValue[]) {
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

export { type ClassValue }
