import { type ClassValue } from "src/index"
import { parser } from "src/lite/processor/parser"

function toVal(mix: ClassValue): string {
    let k = 0,
        y: string,
        str = ""
    if (typeof mix === "string" || typeof mix === "number") {
        str += mix.toString()
    } else if (typeof mix === "object" && mix !== null) {
        if (Array.isArray(mix)) {
            const len = mix.length
            for (; k < len; k++) {
                if (mix[k]) {
                    y = toVal(mix[k] as ClassValue)
                    str += y && (str && " ") + y
                }
            }
        } else {
            str += parser(mix)
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
            str += x && (str && " ") + x
        }
    }
    return str
}

export { type ClassValue }
export default twg
