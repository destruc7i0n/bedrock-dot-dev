import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

import vercelRedirects from "./src/integrations/vercel-redirects";
import nprogress from "astro-nprogress";

export default defineConfig({
  site: "https://bedrock.dev",
  output: "static",
  prefetch: true,
  integrations: [tailwind(), react(), nprogress(), vercelRedirects()],
  adapter: vercel(),
  build: {
    redirects: false,
    concurrency: 10,
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--font-inter",
        weights: [400, 500, 600, 700],
        styles: ["normal"],
        subsets: ["latin"],
        display: "swap",
      },
      {
        provider: fontProviders.google(),
        name: "Fira Code",
        cssVariable: "--font-fira-code",
        weights: [400, 500, 600, 700],
        styles: ["normal"],
        subsets: ["latin"],
        display: "swap",
      },
      {
        provider: "local",
        name: "Monocraft",
        cssVariable: "--font-monocraft",
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/Monocraft.ttf"],
            display: "swap",
          },
        ],
      },
    ],
  },
});
