import { ALGOLIA_MCP_TOOL, ALGOLIA_MCP_URL } from "./constants/algolia";
import { LIVE_URL } from "./constants/env";
import type { Tag } from "./types";

export const docPath = (tag: Tag | string, file: string) =>
  `/docs/${tag}/${encodeURIComponent(file)}`;

export const docMarkdownPath = (tag: Tag | string, file: string) =>
  `${docPath(tag, file)}.md`;

export const frontmatter = (fields: Record<string, string>) =>
  [
    "---",
    ...Object.entries(fields).map(([key, value]) => `${key}: ${value}`),
    "---",
  ].join("\n");

// every markdown response points back at the index
export const indexBanner = (...extra: string[]) =>
  [
    `> Documentation index: ${LIVE_URL}/llms.txt`,
    ...extra.map((line) => `> ${line}`),
  ].join("\n");

// used by llms.txt and index.md, so both say the same thing
export const WHEN_TO_USE = [
  "## When to use this",
  "",
  "Covers Minecraft: Bedrock Edition add-on development: behavior and resource pack",
  "JSON, entity, block and item components and events, Molang, particles, animations,",
  "UI, scripting and schemas. Use it to look up what a field accepts, whether something",
  "is in the stable release or only in preview, and what changed between game versions.",
  "",
  "How to fetch it:",
  "",
  "- Append `.md` to any `/docs/stable/` or `/docs/beta/` URL, or send `Accept: text/markdown`",
  "- `/static/docs.json` is the full version and file manifest",
  "- Versioned `/docs/<major>/<minor>/` pages are HTML only and have no `.md` twin",
  "- `/packs.md` lists Mojang's default template packs per version",
  "- Some pages are large (Addons, Entities); fetch them in chunks",
  "- Search the docs over MCP to find the right page first, see below",
].join("\n");

// the search index is exposed over mcp, so agents can locate a page before fetching it
export const SEARCH = [
  "## Search",
  "",
  `The documentation search index is available over MCP at \`${ALGOLIA_MCP_URL}\``,
  "(streamable HTTP, no authentication, read-only, scoped to this site).",
  "",
  `The \`${ALGOLIA_MCP_TOOL}\` tool takes a \`queries\` array of up to five variations, each`,
  "with a `query` and optional `facet_lang` (`en`) and `facet_type` (`lvl1`-`lvl5`,",
  "`content`) filters. It also requires `originalQuery`, `sessionId` and `userIntent`.",
  "Every hit carries the page `url` and its `anchor`.",
  "",
  "Prefer it over fetching pages speculatively: resolve a symbol to its page and anchor,",
  "then read that page. Searching `minecraft:explode` returns",
  "`/docs/stable/Entities#minecraft:explode`, so fetch `/docs/stable/Entities.md` and go",
  "to that anchor rather than downloading every entity page to find one component.",
  "",
  "Heading records pinpoint a symbol but have a null `content`; records with",
  "`type: content` carry surrounding prose. Most of this documentation is tables and",
  "schemas, so treat search as a way to locate a page, and the `.md` page as the source.",
].join("\n");
