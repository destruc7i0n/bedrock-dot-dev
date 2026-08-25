import type { APIRoute } from "astro";

import { LIVE_URL } from "@lib/constants/env";
import { PACKS_REPO } from "@lib/constants/packs";
import { getPackVersions } from "@lib/packs";
import { Tag } from "@lib/types";

export const prerender = true;

const label = (tag?: Tag) => {
  if (tag === Tag.Stable) return " (stable)";
  if (tag === Tag.Beta) return " (beta)";
  return "";
};

export const GET: APIRoute = async () => {
  const { versions, sorted } = await getPackVersions();

  const archived = sorted.filter((v) => versions[v].b || versions[v].r);
  const fromGithub = sorted.filter((v) => versions[v].git);

  // no download urls here, they are on the page itself
  const archivedRows = archived.map((version) => {
    const { b, r, t } = versions[version];
    const packs = [b ? "behaviour" : null, r ? "resource" : null].filter(
      Boolean,
    );
    return `- ${version}${label(t)}: ${packs.join(", ")}`;
  });

  const githubRows = fromGithub.map(
    (version) =>
      `- ${version}${label(versions[version].t)}: ${versions[version].git}`,
  );

  const body = [
    "---",
    'title: "Template Packs"',
    `source: ${LIVE_URL}/packs`,
    "---",
    "",
    `> Documentation index: ${LIVE_URL}/llms.txt`,
    "",
    "# Minecraft: Bedrock Edition template packs",
    "",
    "The default behavior and resource packs Mojang ships with each version of",
    "Minecraft: Bedrock Edition, archived further back than Mojang publishes.",
    "",
    "Every version with a pack is listed below. Versions absent from these lists",
    "have nothing available.",
    "",
    `## From Mojang's GitHub releases (${fromGithub.length})`,
    "",
    `Recent versions, published by Mojang at [${PACKS_REPO}](https://github.com/${PACKS_REPO}).`,
    "",
    ...(githubRows.length ? githubRows : ["- none available"]),
    "",
    `## Archived on bedrock.dev (${archived.length})`,
    "",
    `Older versions, predating Mojang's own releases. Download them from`,
    `${LIVE_URL}/packs.`,
    "",
    ...(archivedRows.length ? archivedRows : ["- none available"]),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
