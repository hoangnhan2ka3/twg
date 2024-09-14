import { type ClassValue } from "src"
import { transformer } from "src/extend/lite/processor/transformer"

function toVal(mix: ClassValue, currentKey = "", key = ""): string {
    let k = 0,
        y: string,
        str = ""

    const newKey = currentKey ? currentKey + (key ? ":" + key : "") : key
    const n = newKey && newKey + ":"

    if (typeof mix === "string" || typeof mix === "number") {
        for (const part of mix.toString().split(" ").filter(part => part.trim() !== "")) {
            str += (str && " ") + n + part
        }
    } else if (mix && typeof mix === "object") {
        if (Array.isArray(mix)) {
            for (; k < mix.length; k++) {
                if (mix[k]) {
                    if (y = toVal(mix[k], newKey)) {
                        str += (str && " ") + y
                    }
                }
            }
        } else {
            for (y in mix) {
                if (mix[y]) {
                    const parts = y.trim().includes(" ")
                        ? y.split(" ").map(part => n + part).join(" ")
                        : n + y
                    str += (str && " ") + ((typeof mix[y] === "boolean" || typeof mix[y] === "number")
                        ? parts
                        : toVal(mix[y] as ClassValue, newKey, y)
                    )
                }
            }
        }
    }
    return str
}

function twg(...inputs: ClassValue[]) {
    let i = 0,
        tmp: ClassValue,
        x: string,
        str = ""
    const len = inputs.length
    for (; i < len; i++) {
        if (tmp = inputs[i]) {
            if (x = toVal(tmp)) {
                str += (str && " ") + x
            }
        }
    }
    return str
}

export { type ClassValue, transformer, twg }
