import { defineConfig } from "tsdown"

export default defineConfig({
    entry: ["src/index.ts", "src/transformer.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    shims: true,
    treeshake: true,
    minify: true,
    deps: {
        neverBundle: true
    },
    target: false
})
