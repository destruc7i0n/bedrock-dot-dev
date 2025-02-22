import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

import cn from "classnames";

import { getTags, Tags } from "lib/tags";
import { VERSION } from "lib/html/regex";
import { Locale } from "lib/i18n";

// i18next does not work as well on the server, so we have to use a different method to get the strings
import trans from "public/locales/en/common.json";

export const config = {
  runtime: "edge",
};

const GITHUB_URL_PREFIX =
  "https://raw.githubusercontent.com/destruc7i0n/bedrock-dot-dev/master";

const GITHUB_URL_PREFIX_ASSETS = `${GITHUB_URL_PREFIX}/assets/og`;

const ASSETS = {
  addons: `${GITHUB_URL_PREFIX_ASSETS}/addons/addons_1.png`,
  animations: `${GITHUB_URL_PREFIX_ASSETS}/animations/animations_1.png`,
  biomes: `${GITHUB_URL_PREFIX_ASSETS}/biomes/biomes_1.png`,
  blocks: `${GITHUB_URL_PREFIX_ASSETS}/blocks/blocks_1.png`,
  entities: `${GITHUB_URL_PREFIX_ASSETS}/entities/entities_1.png`,
  item: `${GITHUB_URL_PREFIX_ASSETS}/item/item_1.png`,
  molang: `${GITHUB_URL_PREFIX_ASSETS}/molang/molang_1.png`,
  particles: `${GITHUB_URL_PREFIX_ASSETS}/particles/particles_1.png`,
  recipes: `${GITHUB_URL_PREFIX_ASSETS}/recipes/recipes_1.png`,
};

const getAsset = async (file: string): Promise<string | null> => {
  const name = file.toLowerCase().replace(/ /g, "_") as keyof typeof ASSETS;
  if (!ASSETS.hasOwnProperty(name)) return null;

  const asset = ASSETS[name];

  const arrayBuffer = await fetch(asset).then((res) => res.arrayBuffer());
  return (
    "data:image/png;base64," +
    btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
  );
};

export default async function (req: NextRequest) {
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
    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get("file")?.slice(0, 100) ?? "";
    const versionParam = searchParams.get("version");

    let file = fileParam;
    let taggedVersion = null;
    let version = null;

    switch (versionParam) {
      case Tags.Stable: {
        taggedVersion = Tags.Stable;
        version = tags.stable[1];
        break;
      }
      case Tags.Beta: {
        taggedVersion = Tags.Beta;
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

    const bgColorMap = {
      "bg-yellow-500": taggedVersion === Tags.Beta,
      "bg-blue-600": versionParam !== Tags.Beta,
    };

    const docsPageLayout = (
      <div tw="bg-gray-50 flex flex-row w-full h-full pl-16">
        <div
          tw={cn("absolute bottom-0 left-0 min-w-screen h-1", bgColorMap)}
          style={{
            boxShadow: `0 0 35px 5px ${
              taggedVersion === Tags.Beta
                ? "rgba(234, 179, 8, 0.6)"
                : "rgba(37, 99, 235, 0.6)"
            }`,
          }}
        />
        <div tw="flex flex-col justify-center h-full w-[70%]">
          <h2 tw="font-bold text-4xl font-bold text-gray-500 mb-0">
            bedrock.dev
          </h2>
          <h1
            tw={cn("font-extrabold mb-0 ml-0", {
              "text-9xl": file.length < 16,
              "text-8xl": file.length >= 16,
            })}
          >
            {file}
          </h1>
          <h2 tw="text-5xl font-medium mt-2">
            {trans["page"]["docs"]["website_title_tagged_stable"].replace(
              "{{title}} ",
              "",
            )}
          </h2>
          <div tw="flex flex-row">
            {taggedVersion && (
              <h3
                tw={cn(
                  "text-4xl p-2 px-4 mr-4 rounded-xl text-white",
                  bgColorMap,
                )}
              >
                {
                  trans["component"]["version_chooser"][
                    `${taggedVersion}_string`
                  ]
                }
              </h3>
            )}

            {version && (
              <h3 tw="text-4xl p-2 px-4 bg-gray-200 rounded-xl">{version}</h3>
            )}
          </div>
        </div>
        {asset && (
          <div tw="flex flex-1 h-full items-center">
            <img src={asset} width={256} height={256} />
          </div>
        )}
      </div>
    );

    const defaultLayout = (
      <div tw="bg-gray-50 w-full h-full flex flex-col justify-center pl-16">
        <h1 tw="font-extrabold text-9xl">bedrock.dev</h1>
        <h2 tw="font-medium text-4xl">{trans["page"]["home"]["subtitle"]}</h2>
      </div>
    );

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            fontFamily: '"Inter"',
            backgroundColor: "white",
          }}
        >
          {file ? docsPageLayout : defaultLayout}
        </div>
      ),
      {
        debug: false,
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
  } catch (e: any) {
    console.log(`error: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
