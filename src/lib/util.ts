import type { BedrockVersions } from "@lib/versions/types";

import { getVersionTag } from "./tags/util";
import type { TagsResponse } from "./types";
import { Tag } from "./types";
import { compareBedrockVersions } from "./versions/helpers";

export const PACK_BASE_URL = "https://void.bedrock.dev";

export const getPackUrl = (
  folder: "behaviours" | "resources",
  version: string,
): string => {
  return `${PACK_BASE_URL}/${folder}/${version}.zip`;
};

export const getLink = (
  major: string,
  minor: string,
  file: string,
  tags: TagsResponse,
  replaceWithTagged: boolean = true,
) => {
  file = encodeURI(file);
  if (replaceWithTagged) {
    const version = [major, minor];
    const tag = getVersionTag(version, tags);
    if (tag === Tag.Stable) return `/docs/stable/${file}`;
    if (tag === Tag.Beta) return `/docs/beta/${file}`;
  }
  return `/docs/${major}/${minor}/${file}`;
};

export const getMinorVersionTitle = (
  version: string[],
  tags: TagsResponse,
  t: (a: string) => string,
) => {
  let title = version[1];
  const tag = getVersionTag(version, tags);
  if (tag === Tag.Beta)
    title += ` (${t("component.version_chooser.beta_string")})`;
  if (tag === Tag.Stable)
    title += ` (${t("component.version_chooser.stable_string")})`;
  return title;
};

export const addHashIfNeeded = (s: string) => {
  return s[0] === "#" ? s : `#${s}`;
};

export const removeHashIfNeeded = (s: string) => s.replace("#", "");

export const getTagFromSlug = (slug: string | string[] | undefined) => {
  if (typeof slug === "object" && slug.length === 2) {
    if (["stable", "beta"].includes(slug[0])) {
      if (slug[0] === "stable") return Tag.Stable;
      else if (slug[0] === "beta") return Tag.Beta;
    }
  }
  return null;
};

export type ParsedUrlResponse = {
  major: string;
  minor: string;
};

export const parseUrlQuery = (
  query: string,
  versions: BedrockVersions,
): ParsedUrlResponse => {
  const parts = query.split("/");

  const parsed: ParsedUrlResponse = { major: "", minor: "" };
  const [major, minor] = parts;

  if (major && versions[major]) {
    parsed["major"] = parts[0];
    if (minor && versions[major][minor]) {
      parsed["minor"] = parts[1];
    }
  }

  return parsed;
};

export const updateFileNames = (fileName: string): string => {
  switch (fileName) {
    case "MoLang":
      return "Molang";
    default:
      return fileName;
  }
};

export const isVersionSince = (version: string, since: string) => {
  return compareBedrockVersions(since, version) >= 0;
};

export const isVersionBefore = (version: string, before: string) => {
  return compareBedrockVersions(before, version) < 0;
};

export const isNewMolangFilename = (version: string): boolean => {
  // check if version is newer than the one Mojang changed the MoLang to Molang
  return isVersionSince(version, "1.17.30.24");
};

export const oneLine = (str: string) =>
  str
    .split(/\r?\n/)
    .map((e) => e.trim())
    .join("");

export const isProduction = (): boolean => {
  if (typeof process !== "undefined" && process.env?.NODE_ENV) {
    return process.env.NODE_ENV === "production";
  }
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env.PROD;
  }
  return false;
};
