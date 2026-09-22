import type { APIRoute } from "astro";
import { experimental_getFontFileURL, fontData } from "astro:assets";

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

// Cache only the small, fixed set of images used by this warm function.
const assetCache = new Map<string, Promise<string | null>>();

const getAsset = (file: string): Promise<string | null> => {
  const name = file.toLowerCase().replace(/ /g, "_");
  if (!ASSET_NAMES.includes(name as (typeof ASSET_NAMES)[number]))
    return Promise.resolve(null);

  let asset = assetCache.get(name);
  if (!asset) {
    asset = fetch(`${GITHUB_URL_PREFIX_ASSETS}/${name}.png`)
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`Could not load OG image: ${response.status}`);
        return `data:image/png;base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
      })
      .catch(() => {
        assetCache.delete(name);
        return null;
      });
    assetCache.set(name, asset);
  }
  return asset;
};

// built once so warm invocations reuse the parsed fonts
let rendererPromise: Promise<Renderer> | null = null;

const getRenderer = (requestUrl: URL) => {
  rendererPromise ??= (async () => {
    const renderer = new Renderer();

    const fonts = fontData["--font-inter"];
    if (!fonts?.length)
      throw new Error("Inter is not configured in Astro fonts");

    await Promise.all(
      fonts.map(async (font) => {
        const source = font.src.find((source) => "url" in source);
        if (!source || !("url" in source))
          throw new Error("Inter font file is missing");
        const response = await fetch(
          experimental_getFontFileURL(source.url, requestUrl),
        );
        if (!response.ok)
          throw new Error(`Could not load Inter font: ${response.status}`);
        await renderer.registerFont({
          name: "Inter",
          data: await response.arrayBuffer(),
          weight: font.weight ? Number.parseInt(font.weight, 10) : undefined,
          style: font.style ?? "normal",
        });
      }),
    );

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

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const tags = await getTags(Locale.English);

    const { searchParams } = new URL(request.url);
    const file = searchParams.get("file")?.slice(0, TITLE_MAX_LENGTH) ?? "";

    const resolved = resolveVersion(searchParams.get("version"), tags);
    if (!resolved) return new Response("Invalid version", { status: 400 });

    const [asset, renderer] = await Promise.all([
      getAsset(file),
      getRenderer(url),
    ]);

    const image = new ImageResponse(OgCard({ file, asset, ...resolved }), {
      ...SIZE,
      renderer,
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
