import type { APIRoute } from "astro";

import { LIVE_URL } from "@lib/constants/env";
import { getTaggedFiles } from "@lib/docs/tagged";
import { Locale, t } from "@lib/i18n";
import {
  docMarkdownPath,
  frontmatter,
  SEARCH,
  WHEN_TO_USE,
} from "@lib/markdown";
import { Tag } from "@lib/types";

export const prerender = true;

export const GET: APIRoute = async () => {
  const tagged = await getTaggedFiles(Locale.English);
  const stable = tagged[Tag.Stable];
  const beta = tagged[Tag.Beta];

  const links = (tag: Tag, files: string[]) =>
    files
      .map((file) => `- [${file}](${LIVE_URL}${docMarkdownPath(tag, file)})`)
      .join("\n");

  const meta = frontmatter({
    title: '"bedrock.dev"',
    source: `${LIVE_URL}/`,
  });

  const body = `${meta}

# bedrock.dev

${t("page.home.website_description")}. An unofficial, community-maintained mirror of
Mojang's published Minecraft: Bedrock Edition add-on documentation, browsable by
game version. Documentation is available for every release back to 1.2.

${WHEN_TO_USE}

${SEARCH}

## URL scheme

- \`/docs/stable/<file>\` - current stable release (${stable.minor})
- \`/docs/beta/<file>\` - current preview release (${beta.minor})
- \`/docs/<major>/<minor>/<file>\` - a specific version, e.g. \`/docs/${stable.major}/${stable.minor}/Entities\`
- \`/r/<file>\` and \`/b/<file>\` - shortcuts for stable and beta

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
