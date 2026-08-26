import type { APIRoute } from "astro";

import { LIVE_URL } from "@lib/constants/env";
import { getTaggedFiles } from "@lib/docs/tagged";
import { Locale, t } from "@lib/i18n";
import { docMarkdownPath, WHEN_TO_USE } from "@lib/markdown";
import { Tag } from "@lib/types";

export const prerender = true;

// https://llmstxt.org
const section = (heading: string, version: string, tag: Tag, files: string[]) =>
  [
    `## ${heading} (${version})`,
    "",
    ...files.map(
      (file) => `- [${file}](${LIVE_URL}${docMarkdownPath(tag, file)})`,
    ),
  ].join("\n");

export const GET: APIRoute = async () => {
  const tagged = await getTaggedFiles(Locale.English);
  const stable = tagged[Tag.Stable];
  const beta = tagged[Tag.Beta];

  const body = [
    "# bedrock.dev",
    "",
    `> ${t("page.home.website_description")}. An unofficial, community-maintained mirror of Mojang's published Minecraft: Bedrock Edition add-on documentation, browsable by game version. This file indexes the markdown version of every documentation page.`,
    "",
    WHEN_TO_USE,
    "",
    section("Stable", stable.minor, Tag.Stable, stable.files),
    "",
    section("Beta", beta.minor, Tag.Beta, beta.files),
    "",
    "## Optional",
    "",
    `- [Version and file manifest](${LIVE_URL}/static/docs.json): every documented game version and the files available for each. These versioned pages are HTML only, markdown twins exist for stable and beta only`,
    `- [Template packs archive](${LIVE_URL}/packs.md): Mojang's default behavior and resource packs, per version`,
    `- [Sitemap](${LIVE_URL}/sitemap.xml)`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
