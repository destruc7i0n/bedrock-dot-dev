// Used only by prerendered pages: builds run on Bun, deployed functions on Node.
import { S3Client } from "bun";

import { PACKS_REPO } from "./constants/packs";
import { listReleases } from "./github/api";
import { Locale } from "./i18n";
import { getTags } from "./tags";
import { Tag } from "./types";
import { compareBedrockVersions } from "./versions/helpers";

export type PackVersions = {
  [key: string]: Partial<{ b: boolean; r: boolean; t?: Tag; git: string }>;
};

const VERSION = /(\d+\.\d+\.\d+\.\d+)/;

const listArchivedPaths = async (): Promise<string[]> => {
  if (
    !import.meta.env.R2_ACCESS_KEY_ID_BEDROCK ||
    !import.meta.env.R2_SECRET_ACCESS_KEY_BEDROCK ||
    !import.meta.env.R2_BUCKET_NAME_BEDROCK ||
    !import.meta.env.R2_ENDPOINT_BEDROCK
  ) {
    return [];
  }

  const r2 = new S3Client({
    region: "auto",
    endpoint: import.meta.env.R2_ENDPOINT_BEDROCK,
    bucket: import.meta.env.R2_BUCKET_NAME_BEDROCK,
    accessKeyId: import.meta.env.R2_ACCESS_KEY_ID_BEDROCK,
    secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY_BEDROCK,
  });

  try {
    const paths: string[] = [];
    let continuationToken: string | undefined;
    do {
      const objects = await r2.list({ continuationToken });
      for (const object of objects.contents ?? []) {
        if (object.key.endsWith(".zip")) paths.push(object.key);
      }
      continuationToken = objects.isTruncated
        ? objects.nextContinuationToken
        : undefined;
    } while (continuationToken);
    return paths;
  } catch (error) {
    console.error("Could not list items from bucket!", error);
    return [];
  }
};

// used by the packs page and its markdown twin
export const getPackVersions = async () => {
  const [tags, archivedPaths, releases] = await Promise.all([
    getTags(Locale.English),
    listArchivedPaths(),
    listReleases(PACKS_REPO),
  ]);
  const stableTag = tags[Tag.Stable]?.at(-1) ?? "";
  const betaTag = tags[Tag.Beta]?.at(-1) ?? "";

  const versions: PackVersions = {};

  for (const path of archivedPaths) {
    const [folder, name] = path.split("/");
    if (folder && name) {
      const version = name.replace(".zip", "");
      if (!versions[version]) versions[version] = { b: false, r: false };
      if (folder === "behaviours") versions[version].b = true;
      if (folder === "resources") versions[version].r = true;
    }
  }

  // anything not archived comes from Mojang's releases
  for (const release of releases) {
    const version = release.tag_name.match(VERSION)?.[0];
    if (version && !versions[version])
      versions[version] = { git: release.html_url };
  }

  if (versions[stableTag]) versions[stableTag].t = Tag.Stable;
  if (versions[betaTag]) versions[betaTag].t = Tag.Beta;

  const sorted = Object.keys(versions).sort(compareBedrockVersions);

  return { versions, sorted };
};
