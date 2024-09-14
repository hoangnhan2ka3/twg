import { defineConfig } from "tsup"

export default defineConfig({
    entry: [
        "src/index.ts",
        "src/lite/index.ts",
        "src/extend/index.ts",
        "src/extend/lite/index.ts"
    ],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    shims: true,
    treeshake: true,
    minify: "terser",
    terserOptions: {
        compress: {
            pure_funcs: ["console.log"]
        }
    },
    splitting: false,
    skipNodeModulesBundle: true
})
