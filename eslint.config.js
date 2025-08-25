import { defineConfig } from "eslint-define-config";

export default defineConfig({
  languageOptions: {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      project: "./tsconfig.json",
    },
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
  },
  plugins: {
    "@typescript-eslint": "@typescript-eslint/eslint-plugin",
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-unused-expressions": "off", // kikapcsoljuk a problémás szabályt
  },
});
