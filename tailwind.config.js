import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindForms from "@tailwindcss/forms";

import { BREAKPOINTS } from "./src/lib/breakpoints";

const screens = {
  sm: `${BREAKPOINTS.sm}px`,
  md: `${BREAKPOINTS.md}px`,
  lg: `${BREAKPOINTS.lg}px`,
  xl: `${BREAKPOINTS.xl}px`,
  "2xl": `${BREAKPOINTS["2xl"]}px`,
};

const maxScreens = Object.keys(screens).reduce((acc, key) => {
  acc[`${key}-max`] = { max: screens[key] };
  return acc;
}, {});

const config = {
  mode: "jit",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",

        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",

        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
      },
      colors: {
        // dark theme colours
        "dark-gray": {
          975: "#18191a", // the navbar
          950: "#242526", // the sidebar
          900: "#2d2e2f", // behind the docs
          850: "#3a3b3c", // alt color table
          800: "#3e4042", // accent
          700: "#4b4c4e", // table border
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        mono: ["var(--font-fira-code)", ...fontFamily.mono],
        craft: ["var(--font-monocraft)", ...fontFamily.sans],
      },
    },
    screens: {
      ...screens,
      ...maxScreens,
    },
  },
  variants: {
    opacity: ["hover", "responsive"],
  },
  plugins: [tailwindForms],
};

export default config;
