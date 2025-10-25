// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const locales = ["en", "zh"];

module.exports = {
  locales,
  i18n: {
    defaultLocale: "en",
    locales,
  },
  localePath: path.resolve("./public/locales"),
};
