import type { APIRoute } from "astro";

import { LIVE_URL } from "@lib/constants/env";
import { Locale, t } from "@lib/i18n";
import { getTags } from "@lib/tags";
import { Tag } from "@lib/types";
import { allFilesList } from "@lib/versions/list";

export const prerender = true;

// https://llmstxt.org
const section = (heading: string, version: string, tag: Tag, files: string[]) =>
  [
    `## ${heading} (${version})`,
    "",
    ...files.map(
      (file) =>
        `- [${file}](${LIVE_URL}/docs/${tag}/${encodeURIComponent(file)}.md)`,
    ),
  ].join("\n");

export const GET: APIRoute = async () => {
  const versions = await allFilesList(Locale.English);
  const tags = await getTags(Locale.English);

  const filesFor = (tag: Tag) => {
    const [major, minor] = tags[tag];
    return { minor, files: versions[major]?.[minor] ?? [] };
  };

  const stable = filesFor(Tag.Stable);
  const beta = filesFor(Tag.Beta);

  const body = [
    "# bedrock.dev",
    "",
    `> ${t("page.home.website_description")}. An unofficial, community-maintained mirror of Mojang's published Minecraft: Bedrock Edition add-on documentation, browsable by game version. This file indexes the markdown version of every documentation page. Append \`.md\` to any /docs/stable/ or /docs/beta/ URL (or send \`Accept: text/markdown\`) to get its markdown twin.`,
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
