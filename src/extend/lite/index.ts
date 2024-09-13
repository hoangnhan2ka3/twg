import { type ClassValue } from "src/extend/index"
import { parser } from "src/extend/lite/processor/parser"

function toVal(mix: ClassValue): string {
    let k = 0,
        y: string,
        i = false,
        str = ""
    if (typeof mix === "string" || typeof mix === "number") {
        str += mix.toString()
    } else if (typeof mix === "object" && mix !== null) {
        if (Array.isArray(mix)) {
            const len = mix.length
            for (; k < len; k++) {
                if (mix[k]) {
                    y = toVal(mix[k] as ClassValue)
                    if (y) {
                        str && (str += " ")
                        str += y
                    }
                }
            }
        } else {
            const s = str ? " " : ""
            for (y in mix) {
                if (mix[y] === true || (typeof mix[y] === "number" && mix[y] !== 0)) {
                    str += s + y
                } else {
                    i = true
                }
            }

            if (i) str += s + parser(mix)
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
export default twg
