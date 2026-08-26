// the /api/og.png layout, split out since astro only routes .ts/.js
import { Tag } from "@lib/types";

import trans from "../locales/en/common.json";

const ACCENTS = {
  stable: { bar: "rgb(37, 99, 235)", glow: "rgba(37, 99, 235, 0.85)" }, // blue-600
  beta: { bar: "rgb(234, 179, 8)", glow: "rgba(234, 179, 8, 0.85)" }, // yellow-500
};

// longer titles step down a size
const titleSize = (file: string) =>
  file.length < 16 ? "text-9xl" : file.length < 30 ? "text-8xl" : "text-7xl";

export type OgCardProps = {
  file: string;
  taggedVersion: string | null;
  version: string | null;
  asset: string | null;
};

const Badge = ({ label, color }: { label: string; color?: string }) => (
  <h3
    tw={`flex my-0 mr-4 rounded-xl p-2 px-4 text-4xl ${
      color ? "text-white" : "bg-gray-200"
    }`}
    style={color ? { backgroundColor: color } : undefined}
  >
    {label}
  </h3>
);

const DocsCard = ({ file, taggedVersion, version, asset }: OgCardProps) => {
  const accent = taggedVersion === Tag.Beta ? ACCENTS.beta : ACCENTS.stable;

  return (
    <div
      tw="flex w-full h-full flex-row bg-gray-50 pl-16"
      style={{ position: "relative" }}
    >
      <div
        tw="absolute bottom-0 left-0 flex h-1 w-full"
        style={{
          backgroundColor: accent.bar,
          boxShadow: `0 0 45px 12px ${accent.glow}`,
        }}
      />

      <div tw="flex h-full w-[70%] flex-col justify-center">
        <h2 tw="flex my-0 text-4xl font-bold text-gray-500">bedrock.dev</h2>
        <h1 tw={`flex my-0 font-extrabold wrap-anywhere ${titleSize(file)}`}>
          {file}
        </h1>
        <h2 tw="flex mt-2 mb-0 text-5xl font-medium">
          {trans.page.docs.website_title_tagged_stable.replace("{title} ", "")}
        </h2>

        <div tw="flex flex-row mt-4">
          {taggedVersion && (
            <Badge
              label={
                trans.component.version_chooser[
                  `${taggedVersion}_string` as keyof typeof trans.component.version_chooser
                ]
              }
              color={accent.bar}
            />
          )}
          {version && <Badge label={version} />}
        </div>
      </div>

      {asset && (
        <div tw="flex h-full flex-1 items-center">
          <img src={asset} width={320} height={320} alt="" />
        </div>
      )}
    </div>
  );
};

const HomeCard = () => (
  <div tw="flex h-full w-full flex-col justify-center bg-gray-50 pl-16">
    <h1 tw="flex my-0 text-9xl font-extrabold">bedrock.dev</h1>
    <h2 tw="flex my-0 text-4xl font-medium">{trans.page.home.subtitle}</h2>
  </div>
);

export const OgCard = (props: OgCardProps) => (
  <div tw="flex h-full w-full bg-white" style={{ fontFamily: "Inter" }}>
    {props.file ? <DocsCard {...props} /> : <HomeCard />}
  </div>
);
