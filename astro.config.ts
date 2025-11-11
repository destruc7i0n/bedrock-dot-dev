import { defineConfig, fontProviders } from "astro/config";
import type { RedirectConfig } from "astro";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

import nprogress from "astro-nprogress";

import { getTags } from "./src/lib/tags";
import { Locale } from "./src/lib/i18n";

async function generateRedirects(): Promise<Record<string, RedirectConfig>> {
  const { stable, beta } = await getTags(Locale.English);

  return {
    "/docs/stable": {
      status: 302,
      destination: `/?r=${stable.join("/")}`,
    },
    "/docs/beta": {
      status: 302,
      destination: `/?r=${beta.join("/")}`,
    },
    "/r/MoLang": {
      status: 302,
      destination: "/docs/stable/Molang",
    },
    "/r/[...slug]": "/docs/stable/[...slug]",
    "/r": {
      status: 302,
      destination: `/?r=${stable.join("/")}`,
    },
    "/b/MoLang": {
      status: 302,
      destination: "/docs/beta/Molang",
    },
    "/b/[...slug]": "/docs/beta/[...slug]",
    "/b": {
      status: 302,
      destination: `/?r=${beta.join("/")}`,
    },
  };
}

const redirects = await generateRedirects();

export default defineConfig({
  site: "https://bedrock.dev",
  prefetch: true,
  integrations: [tailwind(), react(), nprogress()],
  adapter: vercel(),
  redirects,
  build: {
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
