import { fixupPluginRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import eslint from "@eslint/js"
import stylisticPlugin from "@stylistic/eslint-plugin"
import importNewlines from "eslint-plugin-import-newlines"
import simpleImportPlugin from "eslint-plugin-simple-import-sort"
import path from "path"
import tseslint from "typescript-eslint"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslint.configs.recommended
})

/**
 * @param {string} name the plugin name
 * @param {string} alias the plugin alias
 * @returns {import("eslint").ESLint.Plugin}
 */
function legacyPlugin(name, alias = name) {
    const plugin = compat.plugins(name)[0]?.plugins?.[alias]

    if (!plugin) {
        throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`)
    }

    return fixupPluginRules(plugin)
}

export default tseslint.config(
    eslint.configs.recommended,
    ...compat.extends(
        "plugin:import/typescript"
    ),
    //* Global Config
    {
        ignores: [
            "**/node_modules/", "**/.git/", "**/dist/"
        ]
    },
    {
        //? Default ESLint rules here
        rules: {
            "no-unused-vars": 0
        }
    },
    //* TypeScript Plugin
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked
        ],
        plugins: {
            "@typescript-eslint": tseslint.plugin
        },
        linterOptions: {
            reportUnusedDisableDirectives: "warn"
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
                sourceType: "module",
                ecmaVersion: "latest"
            }
        },
        rules: {
            "@typescript-eslint/no-unused-vars": 0,
            "@typescript-eslint/require-await": 0,
            "@typescript-eslint/no-non-null-assertion": 0,
            "@typescript-eslint/use-unknown-in-catch-callback-variable": 0,
            "@typescript-eslint/unbound-method": 0,
            "@typescript-eslint/no-unused-expressions": 0,
            "@typescript-eslint/no-implied-eval": 0,
            // "@typescript-eslint/no-unnecessary-template-expression": 1,
            "@typescript-eslint/consistent-type-imports": [1, {
                prefer: "type-imports",
                fixStyle: "inline-type-imports"
            }],
            "@typescript-eslint/consistent-generic-constructors": 1,
            "@typescript-eslint/no-unnecessary-condition": 1,
            "@typescript-eslint/no-unnecessary-template-expression": 1,
            "@typescript-eslint/prefer-nullish-coalescing": 1,
            "@typescript-eslint/no-unnecessary-type-parameters": 1,
            "@typescript-eslint/prefer-regexp-exec": 1
        }
    },
    //* JavaScript Plugin (Disable Type Checked)
    {
        files: [
            "**/*.js"
        ],
        extends: [
            tseslint.configs.disableTypeChecked
        ]
    },
    //* Stylistic Plugin
    {
        files: [
            "**/*.{js,cjs,mjs,ts,tsx}"
        ],
        ignores: [
            "**/*.mdx"
        ],
        plugins: {
            "@stylistic": stylisticPlugin
        },
        rules: {

            // 0: Off, 1: Warning, 2: Error

            "no-console": [1, { allow: ["warn", "error"] }],

            //! Quotes
            "@stylistic/quotes": [1, "double", { "avoidEscape": true }],

            //! Commas
            "@stylistic/comma-dangle": [1, "never"],
            "@stylistic/comma-style": 1,

            //! Semis
            "@stylistic/semi": [1, "never"],
            "@stylistic/no-extra-semi": 1,
            "@stylistic/semi-spacing": 1,
            "@stylistic/semi-style": 1,

            //! Operators
            "@stylistic/dot-location": [1, "property"],
            "@stylistic/operator-linebreak": [1, "before"],

            //! Types
            "@stylistic/type-annotation-spacing": 1,
            "@stylistic/type-generic-spacing": 1,
            "@stylistic/type-named-tuple-spacing": 1,

            //! Disallow
            "@stylistic/no-confusing-arrow": 1,
            "@stylistic/no-floating-decimal": 1,
            "@stylistic/no-multiple-empty-lines": [1, {
                "max": 1, "maxEOF": Infinity, "maxBOF": 0
            }],

            //! Misc
            "@stylistic/max-statements-per-line": 1,
            "@stylistic/member-delimiter-style": [1, {
                "multiline": {
                    "delimiter": "comma",
                    "requireLast": false
                },
                "singleline": {
                    "delimiter": "comma",
                    "requireLast": false
                }
            }],
            "@stylistic/nonblock-statement-body-position": 1,
            "@stylistic/one-var-declaration-per-line": 1,

            //! Spacing
            // "@stylistic/indent": [1, 4],
            // "@stylistic/indent-binary-ops": [1, 4],
            "@stylistic/no-tabs": 0,
            "@stylistic/array-bracket-spacing": 1,
            "@stylistic/comma-spacing": 1,
            "@stylistic/arrow-spacing": 1,
            "@stylistic/block-spacing": 1,
            "@stylistic/key-spacing": 1,
            "@stylistic/keyword-spacing": 1,
            "@stylistic/computed-property-spacing": 1,
            "@stylistic/no-mixed-spaces-and-tabs": [1, "smart-tabs"],
            "@stylistic/no-multi-spaces": 1,
            "@stylistic/no-whitespace-before-property": 1,
            "@stylistic/object-curly-spacing": [1, "always"],
            "@stylistic/rest-spread-spacing": 1,
            "@stylistic/space-before-blocks": 1,
            // "@stylistic/space-before-function-paren": [1, "never"],
            "@stylistic/space-in-parens": 1,
            "@stylistic/space-infix-ops": 1,
            "@stylistic/space-unary-ops": 1,
            "@stylistic/switch-colon-spacing": 1,
            "@stylistic/template-curly-spacing": 1,
            "@stylistic/template-tag-spacing": 1,

            //! Comments
            "@stylistic/spaced-comment": [1, "always", {
                "block": {
                    "exceptions": ["-", "+", "*"],
                    "balanced": true
                },
                "markers": [
                    "/", "//", "!", "?", "*", "css", "js", "ts",
                    "html", "html-inline", "template", "inline-template"
                ]
            }],
            "@stylistic/lines-around-comment": [1, {
                "allowObjectStart": true,
                "allowBlockStart": true,
                "allowArrayStart": true
            }],

            //! Line-breaks
            // "@stylistic/eol-last": 1,
            "@stylistic/padding-line-between-statements": [1,
                {
                    "blankLine": "always", "prev": "directive", "next": "*"
                }, {
                    "blankLine": "any", "prev": "directive", "next": "directive"
                }
            ],

            //! Brackets
            "@stylistic/brace-style": [1, "1tbs", { "allowSingleLine": true }],
            "@stylistic/new-parens": 1,
            "@stylistic/wrap-regex": 1
        }
    },
    //* Legacy Plugins
    {
        files: [
            "**/*.{js,cjs,mjs,ts,tsx}"
        ],
        ignores: [
            "**/*.mdx"
        ],
        settings: {
            "import/resolver": {
                node: true,
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json"
                }
            }
        },
        plugins: {
            import: legacyPlugin("eslint-plugin-import", "import"),
            "simple-import-sort": simpleImportPlugin,
            "import-newlines": importNewlines
        },
        rules: {
            "import/first": 1,
            "import/newline-after-import": 1,
            "import/no-duplicates": [1, { "prefer-inline": true }],
            "import/no-unresolved": 1,
            "import/extensions": [1, "never"],
            "import/consistent-type-specifier-style": [1, "prefer-inline"],

            "import-newlines/enforce": [1, { items: 40, "max-len": 95, "semi": false }],

            "simple-import-sort/imports": 1,
            "simple-import-sort/exports": 1
        }
    }
)
