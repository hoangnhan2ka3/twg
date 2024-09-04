import { defineConfig } from "tsup"

export default defineConfig({
    entry: [
        "src/index.ts",
        "src/replacer/index.ts",
        "src/lite/index.ts",
        "src/lite/replacer/index.ts",
        "src/extend/index.ts",
        "src/extend/replacer/index.ts",
        "src/extend/lite/index.ts",
        "src/extend/lite/replacer/index.ts"
    ],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    shims: true,
    minify: "terser",
    terserOptions: {
        compress: {
            pure_funcs: ["console.log"]
        }
    },
    splitting: false,
    skipNodeModulesBundle: true
})
