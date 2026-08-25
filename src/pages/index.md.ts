import type { APIRoute } from "astro";

import { LIVE_URL } from "@lib/constants/env";
import { Locale, t } from "@lib/i18n";
import { getTags } from "@lib/tags";
import { Tag } from "@lib/types";
import { allFilesList } from "@lib/versions/list";

export const prerender = true;

export const GET: APIRoute = async () => {
  const versions = await allFilesList(Locale.English);
  const tags = await getTags(Locale.English);

  const filesFor = (tag: Tag) => {
    const [major, minor] = tags[tag];
    return { major, minor, files: versions[major]?.[minor] ?? [] };
  };

  const stable = filesFor(Tag.Stable);
  const beta = filesFor(Tag.Beta);

  const links = (tag: Tag, files: string[]) =>
    files
      .map(
        (file) =>
          `- [${file}](${LIVE_URL}/docs/${tag}/${encodeURIComponent(file)}.md)`,
      )
      .join("\n");

  const body = `---
title: "bedrock.dev"
source: ${LIVE_URL}/
---

# bedrock.dev

${t("page.home.website_description")}. An unofficial, community-maintained mirror of
Mojang's published Minecraft: Bedrock Edition add-on documentation, browsable by
game version. Documentation is available for every release back to 1.2.

## URL scheme

- \`/docs/stable/<file>\` - current stable release (${stable.minor})
- \`/docs/beta/<file>\` - current preview release (${beta.minor})
- \`/docs/<major>/<minor>/<file>\` - a specific version, e.g. \`/docs/${stable.major}/${stable.minor}/Entities\`
- \`/r/<file>\` and \`/b/<file>\` - shortcuts for stable and beta

Append \`.md\` to any \`/docs/stable/\` or \`/docs/beta/\` URL, or send
\`Accept: text/markdown\`, to get the markdown representation. Versioned
\`/docs/<major>/<minor>/\` pages are HTML only and have no \`.md\` twin.

## Stable (${stable.minor})

${links(Tag.Stable, stable.files)}

## Beta (${beta.minor})

${links(Tag.Beta, beta.files)}

## Other

- [Template packs archive](${LIVE_URL}/packs.md)
- [Version and file manifest](${LIVE_URL}/static/docs.json): HTML only, no \`.md\` twins
- [Full index for agents](${LIVE_URL}/llms.txt)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
