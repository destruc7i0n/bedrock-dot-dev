import type { APIRoute } from "astro";

import { LIVE_URL } from "@lib/constants/env";
import { processDocFile } from "@lib/docs/process-file";
import { MARKDOWN_TRANSFORMS } from "@lib/html/transforms";
import { Locale } from "@lib/i18n";
import { getTags } from "@lib/tags";
import { Tag, TagValues } from "@lib/types";
import { allFilesList } from "@lib/versions/list";

export const prerender = true;

// only the tagged routes, same as the sitemap
export async function getStaticPaths() {
  const versions = await allFilesList(Locale.English);
  const tags = await getTags(Locale.English);

  return TagValues.flatMap((tag) => {
    const [major, minor] = tags[tag as Tag];
    const files = versions[major]?.[minor] ?? [];

    return files.map((file) => ({
      params: { slug: `${tag}/${file}` },
      props: { major, minor, file, tag },
    }));
  });
}

export const GET: APIRoute = async ({ props }) => {
  const { major, minor, file, tag } = props as {
    major: string;
    minor: string;
    file: string;
    tag: string;
  };

  const doc = await processDocFile(
    [major, minor, file],
    Locale.English,
    MARKDOWN_TRANSFORMS,
  );

  if (!doc) {
    return new Response(`Documentation not found: ${tag}/${file}`, {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(doc.title.title || file)}`,
    `version: ${doc.title.version || minor}`,
    `channel: ${tag}`,
    `source: ${LIVE_URL}/docs/${tag}/${encodeURIComponent(file)}`,
    "---",
  ].join("\n");

  // point back at the index
  const banner = [
    `> Documentation index: ${LIVE_URL}/llms.txt`,
    "> Append `.md` to any /docs/stable/ or /docs/beta/ URL for markdown.",
  ].join("\n");

  return new Response(`${frontmatter}\n\n${banner}\n\n${doc.html}`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
