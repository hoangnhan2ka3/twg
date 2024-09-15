import { transformer, type TransformerOptions } from "src/extend/processor/transformer"
import { type ClassValue } from "src/index"

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
 * @param {TWGOptions} [options = {separator=":"}] Contains `separator`. See [docs](https://github.com/hoangnhan2ka3/twg/blob/main/docs/options.md#twg-options).
 * @returns {string} `string`
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
function toVal(mix: ClassValue, options?: TWGOptions, currentKey = "", key = ""): string {
    let k = 0,
        y: string,
        str = ""

    const separator = options?.separator ? options.separator : ""
    const newKey = currentKey ? currentKey + (key ? separator + key : "") : key
    const n = newKey && newKey + separator

    if (typeof mix === "string" || typeof mix === "number") {
        for (const part of mix.toString().split(" ").filter(part => part.trim() !== "")) {
            str += (str && " ") + n + part
        }
    } else if (mix && typeof mix === "object") {
        if (Array.isArray(mix)) {
            for (; k < mix.length; k++) {
                if (mix[k]) {
                    if (y = toVal(mix[k], options, newKey)) {
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
                        : toVal(mix[y] as ClassValue, options, newKey, y)
                    )
                }
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
 * @author hoangnhan2ka3 <workwith.hnhan@gmail.com> (https://github.com/hoangnhan2ka3)
 */
function createTwg(options: TWGOptions = {
    separator: ":"
}) {
    return (...inputs: ClassValue[]) => {
        let i = 0,
            tmp: ClassValue,
            x: string,
            str = ""
        const len = inputs.length
        for (; i < len; i++) {
            if (tmp = inputs[i]) {
                if (x = toVal(tmp, options)) {
                    str += (str && " ") + x
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
const twg = (...inputs: ClassValue[]) => createTwg()(...inputs)

export { type ClassValue, createTwg, transformer, type TransformerOptions, twg }
