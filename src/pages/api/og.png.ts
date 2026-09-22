import type { APIRoute } from "astro";

import { Renderer } from "takumi-js/node";
import { ImageResponse } from "takumi-js/response";

import { OgCard } from "@components/og-card";

import { VERSION } from "@lib/html/regex";
import { Locale } from "@lib/i18n";
import { getTags } from "@lib/tags";
import { Tag } from "@lib/types";

export const prerender = false;

const GITHUB_URL_PREFIX_ASSETS =
  "https://raw.githubusercontent.com/destruc7i0n/bedrock-dot-dev/master/assets/og";

const ASSET_NAMES = [
  "addons",
  "animations",
  "biomes",
  "blocks",
  "entities",
  "item",
  "molang",
  "particles",
  "recipes",
] as const;

const SIZE = { width: 1200, height: 630 };

// only changes when the tagged version does
const OG_CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400";

// the longest real title is 29 chars
const TITLE_MAX_LENGTH = 48;

const FONT_URL_PREFIX =
  "https://unpkg.com/@fontsource/inter@4.5.15/files/inter-latin-ext";

const FONT_WEIGHTS = [400, 500, 700];

const getAsset = async (file: string): Promise<string | null> => {
  const name = file.toLowerCase().replace(/ /g, "_");
  if (!ASSET_NAMES.includes(name as (typeof ASSET_NAMES)[number])) return null;

  // a 404 body would still decode to base64 and only blow up during render
  const arrayBuffer = await fetch(`${GITHUB_URL_PREFIX_ASSETS}/${name}.png`)
    .then((res) => (res.ok ? res.arrayBuffer() : null))
    .catch(() => null);
  if (!arrayBuffer) return null;

  return `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
};

// built once so warm invocations reuse the parsed fonts
let rendererPromise: Promise<Renderer> | null = null;

const getRenderer = () => {
  rendererPromise ??= (async () => {
    const renderer = new Renderer();

    const fonts = await Promise.all(
      FONT_WEIGHTS.map(async (weight) => ({
        name: "Inter",
        data: await fetch(`${FONT_URL_PREFIX}-${weight}-normal.woff`).then(
          (res) => res.arrayBuffer(),
        ),
        weight,
        style: "normal" as const,
      })),
    );

    for (const font of fonts) await renderer.registerFont(font);

    return renderer;
  })().catch((e) => {
    // don't poison every later request
    rendererPromise = null;
    throw e;
  });

  return rendererPromise;
};

// null when the version is unrecognised
const resolveVersion = (
  versionParam: string | null,
  tags: { stable: string[]; beta: string[] },
) => {
  switch (versionParam) {
    case Tag.Stable:
      return { taggedVersion: Tag.Stable, version: tags.stable[1] };
    case Tag.Beta:
      return { taggedVersion: Tag.Beta, version: tags.beta[1] };
    case null:
      return { taggedVersion: null, version: null };
    default:
      if (!versionParam.match(VERSION)) return null;
      return { taggedVersion: null, version: versionParam };
  }
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tags = await getTags(Locale.English);

    const { searchParams } = new URL(request.url);
    const file = searchParams.get("file")?.slice(0, TITLE_MAX_LENGTH) ?? "";

    const resolved = resolveVersion(searchParams.get("version"), tags);
    if (!resolved) return new Response("Invalid version", { status: 400 });

    const asset = await getAsset(file);

    const image = new ImageResponse(OgCard({ file, asset, ...resolved }), {
      ...SIZE,
      renderer: await getRenderer(),
      headers: { "cache-control": OG_CACHE_CONTROL },
    });

    // takumi renders in the body stream, so a failure would ship a broken 200
    await image.ready;

    return image;
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.log(`error: ${errorMessage}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
};
