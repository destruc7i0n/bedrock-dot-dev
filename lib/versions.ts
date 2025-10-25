import { GitHubTreeResponse, listAllFilesFromRepo } from "./github/api";

import Log from "./log";

import { checkCache, setCache } from "./versions-cache";
import { BedrockVersionsByLocale, groupVersionsByLocale, Locale } from "./i18n";

export interface BedrockVersions {
  [key: string]: {
    [key: string]: string[];
  };
}

export type BedrockVersionsFile = {
  versions: {
    [key in Locale]?: BedrockVersions;
  };
  byLocale: BedrockVersionsByLocale;
};

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
    Log.error("Could not list all files!", content.toString());
    return {};
  }
};

export const getVersionsFile = async (): Promise<BedrockVersionsFile> => {
  const file: BedrockVersionsFile = {
    versions: {},
    byLocale: {},
  };
  // console.log('Fetching files list')
  for (const locale of Object.values(Locale)) {
    file.versions[locale] = await getFormattedFilesList(locale);
  }
  file.byLocale = groupVersionsByLocale(file);
  return file;
};

const allFilesList = async (locale: Locale): Promise<BedrockVersions> => {
  // only use local cache in dev
  const check = checkCache();
  if (check) return check.versions[locale] ?? {};
  else {
    if (process.env.NODE_ENV === "production") {
      Log.error("Could not load the docs.json from cache!");
      return {};
    } else {
      const file = await getVersionsFile();
      setCache(file);
      return file.versions[locale] ?? {};
    }
  }
};

export { formatTree, allFilesList, getFormattedFilesList };
