import type { APIRoute } from "astro";

import { LIVE_URL } from "@lib/constants/env";
import { PACK_BASE_URL, PACKS_REPO } from "@lib/constants/packs";
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

  const archivedRows = archived.map((version) => {
    const { b, r, t } = versions[version];
    const links = [
      b ? `[behaviour](${PACK_BASE_URL}/behaviours/${version}.zip)` : null,
      r ? `[resource](${PACK_BASE_URL}/resources/${version}.zip)` : null,
    ].filter(Boolean);
    return `- ${version}${label(t)}: ${links.join(", ")}`;
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
    "Every download that exists is listed below. Versions absent from these lists",
    "have no pack available, and URLs built for them will 404 -- do not construct",
    "pack URLs by pattern, use the ones here.",
    "",
    `## From Mojang's GitHub releases (${fromGithub.length})`,
    "",
    `Recent versions, published by Mojang at [${PACKS_REPO}](https://github.com/${PACKS_REPO}).`,
    "",
    ...(githubRows.length ? githubRows : ["- none available"]),
    "",
    `## Archived on bedrock.dev (${archived.length})`,
    "",
    "Older versions, predating Mojang's own releases.",
    "",
    ...(archivedRows.length ? archivedRows : ["- none available"]),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
