import type { NextConfig } from "next";

import withBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

import { getTags } from "lib/tags";
import { Locale } from "lib/i18n";

const withNextIntl = createNextIntlPlugin();

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const composeConfig = (config: NextConfig) => bundleAnalyzer(withNextIntl(config));

export default composeConfig({
  experimental: {
    // concurrentFeatures: true,
    // serverComponents: true,
    largePageDataBytes: 5 * 1000 * 1000, // 5 MB
  },
  reactStrictMode: true,
  // i18n config removed - not compatible with App Router
  // Using next-intl with i18n/request.ts instead
  outputFileTracingIncludes: {
    "/*": ["public/locales/**/*.json"],
  },
  async redirects() {
    const { stable, beta } = await getTags(Locale.English);

    const version = "\\d+\\.\\d+\\.\\d+\\.\\d+";

    return [
      {
        source: "/docs{/}?",
        destination: "/",
        permanent: false,
      },
      {
        source: `/{docs/}?:path((?:${version})\\/?(?:(?:${version})\\/?)?)`,
        destination: "/?r=:path",
        permanent: false,
      },
      // redirect long fast root links
      {
        source: "/docs/stable{/}?",
        destination: `/?r=${stable.join("/")}`,
        permanent: false,
      },
      {
        source: "/docs/beta{/}?",
        destination: `/?r=${beta.join("/")}`,
        permanent: false,
      },
      // redirect to latest stable
      {
        source: `/(r|c|s)/MoLang`,
        destination: `/docs/stable/Molang`,
        permanent: false,
      },
      {
        source: `/(r|c|s)/:file`,
        destination: `/docs/stable/:file`,
        permanent: false,
      },
      {
        source: "/(r|c|s){/}?",
        destination: `/?r=${stable.join("/")}`,
        permanent: false,
      },
      // redirect to latest beta
      {
        source: `/b/MoLang`,
        destination: `/docs/beta/Molang`,
        permanent: false,
      },
      {
        source: `/b/:file`,
        destination: `/docs/beta/:file`,
        permanent: false,
      },
      {
        source: "/b{/}?",
        destination: `/?r=${beta.join("/")}`,
        permanent: false,
      },
      {
        // match version numbers, old routing
        source: `/:major(${version})/:minor(${version})/:file.:ext?`,
        destination: `/docs/:major/:minor/:file`,
        permanent: true,
      },
    ];
  },
});
