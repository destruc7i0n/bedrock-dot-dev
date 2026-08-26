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
