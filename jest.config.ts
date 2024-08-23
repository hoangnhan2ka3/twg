import { type Config } from "jest"

export default {
    moduleFileExtensions: ["js", "ts"],
    moduleDirectories: ["node_modules", __dirname], /** @see https://stackoverflow.com/a/72437265 */
    transform: { "^.+\\.(t|j)s$": "ts-jest" },
    testRegex: ".*\\.test\\.ts$"
} satisfies Config
