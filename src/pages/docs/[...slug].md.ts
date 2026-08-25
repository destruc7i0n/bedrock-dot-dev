import type { APIRoute } from "astro";

import { LIVE_URL } from "@lib/constants/env";
import { processDocFile } from "@lib/docs/process-file";
import { getTaggedFiles } from "@lib/docs/tagged";
import { MARKDOWN_TRANSFORMS } from "@lib/html/transforms";
import { Locale } from "@lib/i18n";
import { docPath, frontmatter, indexBanner } from "@lib/markdown";

export const prerender = true;

// only the tagged routes, same as the sitemap
export async function getStaticPaths() {
  const tagged = await getTaggedFiles(Locale.English);

  return Object.entries(tagged).flatMap(([tag, { major, minor, files }]) => {
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

  const meta = frontmatter({
    title: JSON.stringify(doc.title.title || file),
    version: doc.title.version || minor,
    channel: tag,
    source: `${LIVE_URL}${docPath(tag, file)}`,
  });

  const banner = indexBanner(
    "Append `.md` to any /docs/stable/ or /docs/beta/ URL for markdown.",
  );

  return new Response(`${meta}\n\n${banner}\n\n${doc.html}`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
