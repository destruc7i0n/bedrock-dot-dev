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
].join("\n");
