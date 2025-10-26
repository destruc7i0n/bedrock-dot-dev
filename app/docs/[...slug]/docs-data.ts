import { cache } from "react";
import { Locale } from "lib/i18n";
import { allFilesList } from "lib/versions";
import { getTags } from "lib/tags";
import { getTagFromSlug } from "lib/util";
import { fetchHtml, extractDataFromHtml } from "lib/html";
import { transformOutbound } from "lib/bedrock-versions-transformer";

export const getDocsHtml = cache(async (slug: string[]) => {
  let version = [...slug];

  const locale = Locale.English;
  const tags = await getTags(locale);

  const versionTag = getTagFromSlug(slug);
  if (versionTag === "stable") {
    version = [...tags.stable, slug[1]];
  } else if (versionTag === "beta") {
    version = [...tags.beta, slug[1]];
  }

  const htmlData = await fetchHtml(version, locale);
  return htmlData;
});

export const getDocsData = cache(async (slug: string[]) => {
  let version = [...slug];

  const locale = Locale.English;
  const bedrockVersions = await allFilesList(locale);
  const tags = await getTags(locale);

  // Handle stable/beta tags
  const versionTag = getTagFromSlug(slug);
  if (versionTag === "stable") {
    version = [...tags.stable, slug[1]];
  } else if (versionTag === "beta") {
    version = [...tags.beta, slug[1]];
  }

  const [major, minor, file] = version;

  // Fetch HTML only for parsing - don't return it
  const htmlData = await fetchHtml(version, locale);
  if (!htmlData) {
    return null; // Indicates 404
  }

  // Parse HTML to extract sidebar and title
  const parsedData = extractDataFromHtml(htmlData.html, file);

  // Transform versions for client - keep compressed format to reduce payload
  const versionsCompressed = transformOutbound(bedrockVersions);

  return {
    major,
    minor,
    file,
    versionTag,
    // Only return title for metadata, don't include in client payload
    titleData: parsedData.title,
    // Only return sidebar, not the full parsedData
    sidebar: parsedData.sidebar,
    tags,
    versionsCompressed,
  };
});
