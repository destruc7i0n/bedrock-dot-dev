import type { APIRoute } from "astro";

import type { ReactElement } from "react";

import { ImageResponse } from "@vercel/og";

import { VERSION } from "@lib/html/regex";
import { Locale } from "@lib/i18n";
import { getTags } from "@lib/tags";
import { Tag } from "@lib/types";

import trans from "../../locales/en/common.json";

export const prerender = false;

const GITHUB_URL_PREFIX =
  "https://raw.githubusercontent.com/destruc7i0n/bedrock-dot-dev/master";

const GITHUB_URL_PREFIX_ASSETS = `${GITHUB_URL_PREFIX}/assets/og`;

const ASSETS = {
  addons: `${GITHUB_URL_PREFIX_ASSETS}/addons.png`,
  animations: `${GITHUB_URL_PREFIX_ASSETS}/animations.png`,
  biomes: `${GITHUB_URL_PREFIX_ASSETS}/biomes.png`,
  blocks: `${GITHUB_URL_PREFIX_ASSETS}/blocks.png`,
  entities: `${GITHUB_URL_PREFIX_ASSETS}/entities.png`,
  item: `${GITHUB_URL_PREFIX_ASSETS}/item.png`,
  molang: `${GITHUB_URL_PREFIX_ASSETS}/molang.png`,
  particles: `${GITHUB_URL_PREFIX_ASSETS}/particles.png`,
  recipes: `${GITHUB_URL_PREFIX_ASSETS}/recipes.png`,
};

const getAsset = async (file: string): Promise<string | null> => {
  const name = file.toLowerCase().replace(/ /g, "_") as keyof typeof ASSETS;
  if (!(name in ASSETS)) return null;

  const asset = ASSETS[name];

  const arrayBuffer = await fetch(asset).then((res) => res.arrayBuffer());
  return (
    "data:image/png;base64," +
    btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
  );
};

const getBgColor = (
  taggedVersion: string | null,
  versionParam: string | null,
) => {
  if (taggedVersion === Tag.Beta) return "rgb(234, 179, 8)"; // yellow-500
  if (versionParam !== Tag.Beta) return "rgb(37, 99, 235)"; // blue-600
  return "rgb(37, 99, 235)"; // default to blue-600
};

const getBoxShadowColor = (taggedVersion: string | null) => {
  return taggedVersion === Tag.Beta
    ? "rgba(234, 179, 8, 0.6)"
    : "rgba(37, 99, 235, 0.6)";
};

export const GET: APIRoute = async ({ request }) => {
  const [fontData, fontMediumData, fontBoldData] = await Promise.all([
    fetch(
      "https://unpkg.com/@fontsource/inter@4.5.15/files/inter-latin-ext-400-normal.woff",
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://unpkg.com/@fontsource/inter@4.5.15/files/inter-latin-ext-500-normal.woff",
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://unpkg.com/@fontsource/inter@4.5.15/files/inter-latin-ext-700-normal.woff",
    ).then((res) => res.arrayBuffer()),
  ]);

  const tags = await getTags(Locale.English);

  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const fileParam = searchParams.get("file")?.slice(0, 100) ?? "";
    const versionParam = searchParams.get("version");

    const file = fileParam;
    let taggedVersion: string | null = null;
    let version: string | null = null;

    switch (versionParam) {
      case Tag.Stable: {
        taggedVersion = Tag.Stable;
        version = tags.stable[1];
        break;
      }
      case Tag.Beta: {
        taggedVersion = Tag.Beta;
        version = tags.beta[1];
        break;
      }
      default: {
        if (versionParam !== null) {
          if (versionParam?.match(VERSION)) {
            version = versionParam;
          } else {
            return new Response("Invalid version", { status: 400 });
          }
        }
        break;
      }
    }

    const asset = await getAsset(fileParam);

    const bgColor = getBgColor(taggedVersion, versionParam);
    const boxShadowColor = getBoxShadowColor(taggedVersion);

    const docsPageLayout = {
      type: "div",
      props: {
        tw: "bg-gray-50 flex flex-row w-full h-full pl-16",
        style: { position: "relative" },
        children: [
          {
            type: "div",
            props: {
              tw: "absolute bottom-0 left-0 min-w-screen h-1",
              style: {
                backgroundColor: bgColor,
                boxShadow: `0 0 35px 5px ${boxShadowColor}`,
              },
            },
          },
          {
            type: "div",
            props: {
              tw: "flex flex-col justify-center h-full w-[70%]",
              children: [
                {
                  type: "h2",
                  props: {
                    tw: "font-bold text-4xl text-gray-500 mb-0",
                    children: "bedrock.dev",
                  },
                },
                {
                  type: "h1",
                  props: {
                    tw:
                      file.length < 16
                        ? "font-extrabold mb-0 ml-0 text-9xl"
                        : "font-extrabold mb-0 ml-0 text-8xl",
                    children: file,
                  },
                },
                {
                  type: "h2",
                  props: {
                    tw: "text-5xl font-medium mt-2",
                    children: trans["page"]["docs"][
                      "website_title_tagged_stable"
                    ].replace("{title} ", ""),
                  },
                },
                {
                  type: "div",
                  props: {
                    tw: "flex flex-row",
                    children: [
                      taggedVersion && {
                        type: "h3",
                        props: {
                          tw: "text-4xl p-2 px-4 mr-4 rounded-xl text-white",
                          style: { backgroundColor: bgColor },
                          children:
                            trans["component"]["version_chooser"][
                              `${taggedVersion}_string` as keyof (typeof trans)["component"]["version_chooser"]
                            ],
                        },
                      },
                      version && {
                        type: "h3",
                        props: {
                          tw: "text-4xl p-2 px-4 bg-gray-200 rounded-xl",
                          children: version,
                        },
                      },
                    ].filter(Boolean),
                  },
                },
              ],
            },
          },
          asset && {
            type: "div",
            props: {
              tw: "flex flex-1 h-full items-center",
              children: {
                type: "img",
                props: {
                  src: asset,
                  width: 256,
                  height: 256,
                  alt: "",
                },
              },
            },
          },
        ].filter(Boolean),
      },
    };

    const defaultLayout = {
      type: "div",
      props: {
        tw: "bg-gray-50 w-full h-full flex flex-col justify-center pl-16",
        children: [
          {
            type: "h1",
            props: {
              tw: "font-extrabold text-9xl",
              children: "bedrock.dev",
            },
          },
          {
            type: "h2",
            props: {
              tw: "font-medium text-4xl",
              children: trans["page"]["home"]["subtitle"],
            },
          },
        ],
      },
    };

    return new ImageResponse(
      {
        type: "div",
        props: {
          style: {
            height: "100%",
            width: "100%",
            display: "flex",
            fontFamily: '"Inter"',
            backgroundColor: "white",
          },
          children: file ? docsPageLayout : defaultLayout,
        },
      } as ReactElement,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: fontMediumData,
            weight: 500,
            style: "normal",
          },
          {
            name: "Inter",
            data: fontBoldData,
            weight: 700,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.log(`error: ${errorMessage}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
};
