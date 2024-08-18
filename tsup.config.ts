import { defineConfig } from "tsup"

export default defineConfig({
    entry: [
        "src/index.ts",
        "src/replacer/index.ts"
    ],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    shims: true,
    minify: false,
    splitting: false,
    skipNodeModulesBundle: true
})
