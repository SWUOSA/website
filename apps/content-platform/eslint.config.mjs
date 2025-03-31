import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import antfu from '@antfu/eslint-config'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  await antfu({
    formatters: true,
    typescript: true,
    unocss: true,
    astro: true,
    react: true,
    vue: true,
    rules: {
      "vue/html-quotes": ["error", "double"],
      "vue/html-indent": ["error", 2],
      "vue/operator-linebreak": ["error", "before"],
      "style/operator-linebreak": ["error", "before"],
      "style/arrow-parens": ["error", "always"],
      "vue/brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "style/brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "style/semi": ["error", "always"],
      "style/quotes": ["error", "double"],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "antfu/top-level-function": "off",
      "vue/block-order": [
        "error",
        {
          order: ["template", "script", "style"],
        },
      ],
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: {
            max: 1,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      "vue/singleline-html-element-content-newline": ["error", {
        ignoreWhenNoAttributes: false,
        ignoreWhenEmpty: false,
        ignores: ["pre", "textarea"],
      }],
      "curly": ["error", "all"],
      "eqeqeq": "off",
      "no-unused-vars": ["error"],
      "vue/eqeqeq": "off",
    },
  }),
];

export default eslintConfig;
