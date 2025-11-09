import "isomorphic-unfetch";

import * as fs from "fs";
import * as path from "path";
import { getTags } from "../src/lib/tags";
import { Locale } from "../src/lib/i18n";

async function generateVercelRedirects() {
  const { stable, beta } = await getTags(Locale.English);
  const version = "\\d+\\.\\d+\\.\\d+\\.\\d+";

  const redirects = [
    {
      source: "/docs",
      destination: "/",
      permanent: false,
    },
    {
      source: "/docs/",
      destination: "/",
      permanent: false,
    },
    {
      source: `/{docs/}?:path((?:${version})\\/?(?:(?:${version})\\/?)?)`,
      destination: "/?r=:path",
      permanent: false,
    },
    {
      source: "/docs/stable",
      destination: `/?r=${stable.join("/")}`,
      permanent: false,
    },
    {
      source: "/docs/stable/",
      destination: `/?r=${stable.join("/")}`,
      permanent: false,
    },
    {
      source: "/docs/beta",
      destination: `/?r=${beta.join("/")}`,
      permanent: false,
    },
    {
      source: "/docs/beta/",
      destination: `/?r=${beta.join("/")}`,
      permanent: false,
    },
    {
      source: "/(r|c|s)/MoLang",
      destination: "/docs/stable/Molang",
      permanent: false,
    },
    {
      source: "/(r|c|s)/:file",
      destination: "/docs/stable/:file",
      permanent: false,
    },
    {
      source: "/(r|c|s)",
      destination: `/?r=${stable.join("/")}`,
      permanent: false,
    },
    {
      source: "/(r|c|s)/",
      destination: `/?r=${stable.join("/")}`,
      permanent: false,
    },
    {
      source: "/b/MoLang",
      destination: "/docs/beta/Molang",
      permanent: false,
    },
    {
      source: "/b/:file",
      destination: "/docs/beta/:file",
      permanent: false,
    },
    {
      source: "/b",
      destination: `/?r=${beta.join("/")}`,
      permanent: false,
    },
    {
      source: "/b/",
      destination: `/?r=${beta.join("/")}`,
      permanent: false,
    },
    {
      source: `/:major(${version})/:minor(${version})/:file.:ext?`,
      destination: "/docs/:major/:minor/:file",
      permanent: true,
    },
  ];

  const vercelJsonPath = path.resolve("vercel.json");

  // Read existing vercel.json if it exists, otherwise start with empty object
  let vercelConfig: any = {};
  if (fs.existsSync(vercelJsonPath)) {
    try {
      const existingContent = fs.readFileSync(vercelJsonPath, "utf-8");
      vercelConfig = JSON.parse(existingContent);
    } catch (error) {
      console.warn(
        "Failed to parse existing vercel.json, starting fresh:",
        error,
      );
      vercelConfig = {};
    }
  }

  // Update/merge redirects into existing config
  vercelConfig.redirects = redirects.map((redirect) => ({
    source: redirect.source,
    destination: redirect.destination,
    permanent: redirect.permanent,
  }));

  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
  console.log("Wrote vercel.json with redirects");
}

generateVercelRedirects().catch(console.error);
