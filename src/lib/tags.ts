import { Locale } from "./i18n";
import * as fs from "fs";
import * as path from "path";
import { DOCS_SUBMODULE_PATH, TAGS_FILE_NAME } from "./docs/constants";

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

const readTagsFromSubmodule = (locale: Locale): TagsResponse => {
  const submodulePath = path.resolve(
    process.cwd(),
    DOCS_SUBMODULE_PATH,
    TAGS_FILE_NAME,
  );

  try {
    const tagsContent = fs.readFileSync(submodulePath, "utf-8");
    const allTags = JSON.parse(tagsContent);
    return allTags[locale] || allTags;
  } catch (error) {
    throw new Error(
      `Failed to read tags.json from submodule: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const getTags = async (locale: Locale): Promise<TagsResponse> => {
  return readTagsFromSubmodule(locale);
};
