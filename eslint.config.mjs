import { defineConfig } from "eslint/config";

import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettier from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";

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
    },
    rules: {
      // disable warnings, since prettier should format on save
      "prettier/prettier": "off",
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
    ignores: ["node_modules/**", "dist/**", ".astro/**", "out/**", "build/**"],
  },
]);
