/** @type {import("prettier").Config} */
export default {
  plugins: [
    "prettier-plugin-astro",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "<BUILTIN_MODULES>",
    "",
    "^astro",
    "",
    "^react$",
    "^react-dom$",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@(components|hooks|layouts)(/.*)?$",
    "",
    "^@(lib|stores|styles)(/.*)?$",
    "",
    "^[.]",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  overrides: [
    {
      files: ["**/*.astro"],
      options: {
        parser: "astro",
      },
    },
  ],
};
