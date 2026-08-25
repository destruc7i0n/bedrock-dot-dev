import { Locale } from "../i18n";
import { getTags } from "../tags";
import { Tag, TagValues } from "../types";
import { allFilesList } from "../versions/list";

export type TaggedFiles = Record<
  Tag,
  { major: string; minor: string; files: string[] }
>;

// the stable and beta sets, which are what the sitemap and the markdown twins
// both cover
export const getTaggedFiles = async (locale: Locale): Promise<TaggedFiles> => {
  const versions = await allFilesList(locale);
  const tags = await getTags(locale);

  return Object.fromEntries(
    TagValues.map((tag) => {
      const [major, minor] = tags[tag as Tag];
      return [tag, { major, minor, files: versions[major]?.[minor] ?? [] }];
    }),
  ) as TaggedFiles;
};
