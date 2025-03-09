import type { NextConfig } from "next";
import path from "path";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const locales = ["en", "zh"];
// tell the bundler that these files should be bundled
path.resolve("./public/locales");

const nextConfig: NextConfig = withBundleAnalyzer({
  experimental: {
    // concurrentFeatures: true,
    // serverComponents: true,
    largePageDataBytes: 5 * 1000 * 1000, // 5 MB
  },
  reactStrictMode: true,
  i18n: {
    defaultLocale: "en",
    locales,
  },
  async redirects() {
    const { stable, beta } = await (
      await fetch(
        "https://raw.githubusercontent.com/bedrock-dot-dev/docs/master/tags.json",
      )
    ).json();

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

export default nextConfig;
