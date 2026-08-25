/**
 * Vercel Redirects Integration
 *
 * This integration generates dynamic redirects for the Vercel Build Output API.
 * It's needed because some redirects depend on runtime data (stable/beta version tags)
 * that aren't available at build time when using Astro's static redirects configuration.
 * Astro's redirects also won't work: https://github.com/withastro/astro/issues/12036
 *
 * The integration writes redirects to `.vercel/output/config.json` after the build completes,
 * allowing us to redirect shortcuts like `/r`, `/b`, `/c`, `/s` to the appropriate docs
 * versions, and handle version-specific URL patterns dynamically.
 */
import * as fs from "fs";
import { fileURLToPath } from "url";

import type { AstroConfig, AstroIntegration } from "astro";

import { Locale } from "../lib/i18n";
import { getTags } from "../lib/tags";

type BuildOutputRoute = {
  src: string;
  dest?: string;
  status?: number;
  headers?: Record<string, string>;
  has?: { type: "header"; key: string; value: string }[];
  continue?: boolean;
};

type BuildOutputConfig = {
  version: number;
  routes?: BuildOutputRoute[];
  [key: string]: unknown;
};

// no lookahead in these patterns, so the rewrites below exclude `.` to skip
// urls that already end in .md
const ACCEPTS_MARKDOWN = [
  { type: "header" as const, key: "accept", value: "(.*)text/markdown(.*)" },
];

const MARKDOWN_CACHE_CONTROL =
  "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";

// don't cache these, the same url also serves html
const MARKDOWN_HEADERS = {
  Vary: "Accept",
  "Cache-Control": "no-store",
};

// https://www.rfc-editor.org/rfc/rfc8288
const DISCOVERY_LINKS = [
  '</llms.txt>; rel="llms-txt"; type="text/plain"',
  '</llms.txt>; rel="service-doc"; type="text/plain"',
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</sitemap.xml>; rel="describedby"; type="application/xml"',
].join(", ");

const alternate = (href: string) =>
  `<${href}>; rel="alternate"; type="text/markdown"`;

// discovery headers and markdown negotiation
function generateAgentRoutes(): BuildOutputRoute[] {
  return [
    {
      src: "^/(.*)$",
      headers: { Link: DISCOVERY_LINKS, Vary: "Accept" },
      continue: true,
    },
    // later routes win on the same header, so these repeat the discovery links
    {
      src: "^/$",
      headers: { Link: `${DISCOVERY_LINKS}, ${alternate("/index.md")}` },
      continue: true,
    },
    {
      src: "^/packs/?$",
      headers: { Link: `${DISCOVERY_LINKS}, ${alternate("/packs.md")}` },
      continue: true,
    },
    {
      src: "^/docs/(stable|beta)/([^/.]+)$",
      headers: { Link: `${DISCOVERY_LINKS}, ${alternate("/docs/$1/$2.md")}` },
      continue: true,
    },
    {
      // these don't change between deploys
      src: "^/(.+)\\.md$",
      headers: { "Cache-Control": MARKDOWN_CACHE_CONTROL },
      continue: true,
    },
    {
      // no extension, so vercel can't infer the type
      src: "^/\\.well-known/api-catalog$",
      headers: { "Content-Type": "application/linkset+json" },
      continue: true,
    },
    {
      src: "^/$",
      has: ACCEPTS_MARKDOWN,
      dest: "/index.md",
      headers: MARKDOWN_HEADERS,
    },
    {
      src: "^/packs/?$",
      has: ACCEPTS_MARKDOWN,
      dest: "/packs.md",
      headers: MARKDOWN_HEADERS,
    },
    {
      src: "^/docs/(stable|beta)/([^/.]+)$",
      has: ACCEPTS_MARKDOWN,
      dest: "/docs/$1/$2.md",
      headers: MARKDOWN_HEADERS,
    },
  ];
}

// https://vercel.com/docs/build-output-api/configuration#routes
async function generateVercelRoutes(): Promise<BuildOutputRoute[]> {
  const { stable, beta } = await getTags(Locale.English);
  const version = "\\d+\\.\\d+\\.\\d+\\.\\d+";

  return [
    {
      src: "^/docs$",
      dest: "/",
      status: 302,
    },
    {
      src: "^/zh(/.*)?$",
      dest: "https://nextjs.bedrock.dev/zh$1",
      status: 302,
    },
    {
      src: `^/{docs}?:path((?:${version})\\/?(?:(?:${version})\\/?)?)$`,
      dest: "/?r=:path",
      status: 302,
    },
    {
      src: "^/docs/stable$",
      dest: `/?r=${stable.join("/")}`,
      status: 302,
    },
    {
      src: "^/docs/beta$",
      dest: `/?r=${beta.join("/")}`,
      status: 302,
    },
    {
      src: "^/(r|c|s)/MoLang$",
      dest: "/docs/stable/Molang",
      status: 302,
    },
    {
      src: "^/(r|c|s)/(.+)$",
      dest: "/docs/stable/$2",
      status: 302,
    },
    {
      src: "^/(r|c|s)$",
      dest: `/?r=${stable.join("/")}`,
      status: 302,
    },
    {
      src: "^/b/MoLang$",
      dest: "/docs/beta/Molang",
      status: 302,
    },
    {
      src: "^/b/(.+)$",
      dest: "/docs/beta/$1",
      status: 302,
    },
    {
      src: "^/b$",
      dest: `/?r=${beta.join("/")}`,
      status: 302,
    },
  ];
}

export default function vercelRedirectsIntegration(): AstroIntegration {
  let _config: AstroConfig | undefined;

  return {
    name: "vercel-redirects",
    hooks: {
      "astro:config:done": ({ config }) => {
        _config = config;
      },
      "astro:build:done": async ({ logger }) => {
        if (!_config) {
          logger.error("Astro config not found");
          return;
        }

        const configPath = new URL(
          "./.vercel/output/config.json",
          _config.root,
        );
        const configPathString = fileURLToPath(configPath);

        if (!fs.existsSync(configPathString)) {
          logger.warn(
            `${configPathString} not found after waiting for Vercel adapter`,
          );
          return;
        }

        const redirects = [
          ...generateAgentRoutes(),
          ...(await generateVercelRoutes()),
        ];

        let config: BuildOutputConfig;

        try {
          const content = await fs.promises.readFile(configPathString, "utf-8");
          config = JSON.parse(content);
        } catch (error) {
          logger.warn(
            `Failed to parse existing config.json: ${error instanceof Error ? error.message : String(error)}`,
          );
          return;
        }

        const existingRoutes = config.routes || [];
        config.routes = [...redirects, ...existingRoutes];

        await fs.promises.writeFile(
          configPathString,
          JSON.stringify(config, null, 2),
        );

        logger.info("Wrote redirects to .vercel/output/config.json");
      },
    },
  };
}
