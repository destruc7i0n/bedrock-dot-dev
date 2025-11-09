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

  const vercelConfig = {
    redirects: redirects.map((redirect) => ({
      source: redirect.source,
      destination: redirect.destination,
      permanent: redirect.permanent,
    })),
  };

  const vercelJsonPath = path.resolve("vercel.json");
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
  console.log("Generated vercel.json with redirects");
}

generateVercelRedirects().catch(console.error);
