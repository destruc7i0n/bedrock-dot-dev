import { RAW_GITHUB_URL } from "./github/constants";
import { getRepository, Locale } from "./i18n";
import fs from "fs";
import path from "path";

export enum Tags {
  Stable = "stable",
  Beta = "beta",
}

export const TagsValues: string[] = Object.keys(Tags).map(
  (k) => Tags[k as keyof typeof Tags],
);

export type TagsResponse = {
  [tag in Tags]: string[];
};
// fetch the tags file from the repository
export const getTags = async (
  locale: Locale,
  forceFetch = false,
): Promise<TagsResponse> => {
  if (process.env.NODE_ENV === "production" && !forceFetch) {
    // fetch from cached file if on server
    // This file is generated during the build process
    try {
      const tagsPath = path.resolve("public/static/tags.json");
      const tagsContent = fs.readFileSync(tagsPath, "utf-8");
      const allTags = JSON.parse(tagsContent);
      return allTags[locale];
    } catch (error) {
      console.error("Error reading tags.json:", error);
      // Fallback to fetching from GitHub if file doesn't exist
      const repo = getRepository(locale);
      const tags = await fetch(
        `${RAW_GITHUB_URL}/${repo.name}/${repo.tag}/tags.json`,
      );
      return await tags.json();
    }
  } else {
    // fetch the tags from the server
    const repo = getRepository(locale);
    const tags = await fetch(
      `${RAW_GITHUB_URL}/${repo.name}/${repo.tag}/tags.json`,
    );
    return await tags.json();
  }
};
