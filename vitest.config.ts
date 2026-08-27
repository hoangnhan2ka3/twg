import { resolve } from "path"

import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        globals: true,
        include: ["**/*.test.ts"]
    },
    resolve: {
        alias: {
            src: resolve(__dirname, "./src")
        }
    }
})
