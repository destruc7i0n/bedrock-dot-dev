import { FlatCache } from "flat-cache";

import type { GitHubTreeResponse } from "../docs/fs";
import { listAllFilesFromRepo } from "../docs/fs";
import { groupVersionsByLocale, Locale } from "../i18n";
import type { BedrockVersions, BedrockVersionsFile } from "./types";

function formatTree(resp: GitHubTreeResponse): BedrockVersions {
  const versions: BedrockVersions = {};

  // convert the recursive output to one that follows `BedrockVersions` format
  for (const treeItem of resp.tree) {
    if (treeItem.type === "blob") {
      // ignore any non html files
      if (!treeItem.path.endsWith(".html")) continue;

      const pathParts = treeItem.path.split("/");
      if (pathParts.length > 1) {
        // [ major, minor, file ]
        let major: string, minor: string, file: string;

        if (pathParts.length === 3) {
          [major, minor, file] = pathParts;
        } else {
          // if 1.8, set to the same version
          [major, file] = pathParts;
          minor = major;
        }

        // initialize the objects
        if (!versions[major]) versions[major] = {};
        if (!versions[major][minor]) versions[major][minor] = [];

        const docName = file.replace(".html", "");

        versions[major][minor].push(docName);
      }
    }
  }

  return versions;
}

const getFormattedFilesList = async (locale: Locale) => {
  const content = await listAllFilesFromRepo(locale);
  if (!(content instanceof Error)) return formatTree(content);
  else {
    console.error("Could not list all files!", content.toString());
    return {};
  }
};

export const getVersionsFile = async (): Promise<BedrockVersionsFile> => {
  const file: BedrockVersionsFile = {
    versions: {},
    byLocale: {},
  };
  for (const locale of Object.values(Locale)) {
    file.versions[locale] = await getFormattedFilesList(locale);
  }
  file.byLocale = groupVersionsByLocale(file);
  return file;
};

const allFilesList = async (locale: Locale): Promise<BedrockVersions> => {
  const cached = checkCache();
  if (cached) return cached.versions[locale] ?? {};

  const file = await getVersionsFile();
  setCache(file);
  return file.versions[locale] ?? {};
};

export { formatTree, allFilesList, getFormattedFilesList };

// caching so we don't have to build the file list every single time
// have a cache invalidation period for dev
const CACHE_DURATION_MINUTES = 10;

const cache = new FlatCache({ cacheId: "versions" });

const checkCache = (): BedrockVersionsFile | undefined => {
  const timestamp: string = cache.getKey("timestamp");

  if (timestamp) {
    const cachedTime = new Date(timestamp);
    const difference = Math.round(
      (new Date().getTime() - cachedTime.getTime()) / 60000,
    );

    const files: BedrockVersionsFile = cache.getKey("files");
    if (difference < CACHE_DURATION_MINUTES && files) return files;
  }
};

const setCache = (file: BedrockVersionsFile) => {
  cache.setKey("timestamp", new Date().getTime());
  cache.setKey("files", file);
  cache.save();
};
