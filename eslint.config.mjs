import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import prettier from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import turbo from "eslint-plugin-turbo";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettier,
      "react-hooks": reactHooks,
      turbo,
    },
    rules: {
      // disable warnings, since prettier should format on save
      "prettier/prettier": "off",
      "turbo/no-undeclared-env-vars": [
        "error",
        { allowList: ["^(DEV|PROD|SSR)$"] },
      ],
    },
  },
  astro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astro.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".astro/**",
      ".vercel/**",
      ".generated/**",
      ".turbo/**",
      "out/**",
      "build/**",
    ],
  },
]);
