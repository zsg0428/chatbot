// eslint.config.js
import js from "@eslint/js"
import globals from "globals"
import next from "eslint-plugin-next"
import tailwindcss from "eslint-plugin-tailwindcss"
import tseslint from "typescript-eslint"

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    next.configs.recommended,
    {
        plugins: {
            tailwindcss,
        },
        rules: {
            "tailwindcss/classnames-order": "warn",
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                project: true,
                tsconfigRootDir: "./",
            },
        },
    },
]
