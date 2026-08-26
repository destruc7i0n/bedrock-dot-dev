import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

import vercelRedirects from "./src/integrations/vercel-redirects";

export default defineConfig({
  site: "https://bedrock.dev",
  output: "static",
  prefetch: true,
  integrations: [react(), vercelRedirects()],
  adapter: vercel(),
  build: {
    redirects: false,
    concurrency: 10,
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["nprogress"],
    },
    server: {
      // vite rejects unknown Host headers
      allowedHosts: true,
    },
  },
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
      provider: fontProviders.local(),
      name: "Monocraft",
      cssVariable: "--font-monocraft",
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/Monocraft.ttf"],
            display: "swap",
          },
        ],
      },
    },
  ],
});
