// @ts-nocheck
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  files: ["**/*.ts", "**/*.vue", "**/*.js"],
  ignores: ["node_modules/**", ".output/**", ".ignore", ".config/**"],
  rules: {
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "prefer-const": "error",
    "no-unused-vars": [
      "error",
      { args: "none", vars: "all", caughtErrors: "none" },
    ],
    "@typescript-eslint/no-explicit-any": 0,
    "vue/valid-v-slot": "off",
    "vue/no-template-shadow": "off",
    "vue/no-mutating-props": "off",
    "vue/attribute-hyphenation": "off",
    // Add or override other rules here
  },
});
