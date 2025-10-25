import { useRouter } from "next/router";

import { BedrockVersionsFile } from "./versions";

export enum Locale {
  English = "en",
  Chinese = "zh",
}

type RepositoryData = {
  [key in Locale]: {
    name: string;
    tag: string;
  };
};

export interface BedrockVersionsByLocale {
  [key: string]: Locale[];
}

const REPOSITORIES: RepositoryData = {
  [Locale.English]: {
    name: "bedrock-dot-dev/docs",
    tag: "master",
  },
  [Locale.Chinese]: {
    name: "MiemieMethod/addons-docs",
    tag: "originid",
  },
};

export const getLocale = (locale?: string): Locale => {
  switch (locale) {
    case "zh":
      return Locale.Chinese;
    default:
      return Locale.English;
  }
};

export const useLocale = () => {
  const router = useRouter();
  return getLocale(router.locale ?? "en");
};

export const getRepository = (locale: Locale) => {
  if (Object.keys(REPOSITORIES).includes(locale)) return REPOSITORIES[locale];
  return REPOSITORIES[Locale.English];
};

export const groupVersionsByLocale = ({ versions }: BedrockVersionsFile) => {
  const byLocale: BedrockVersionsByLocale = {};
  for (const locale of Object.keys(versions) as Locale[]) {
    for (const major of Object.keys(versions[locale] ?? {})) {
      for (const minor of Object.keys(versions[locale]?.[major] ?? {})) {
        if (!byLocale[minor]) byLocale[minor] = [];
        byLocale[minor].push(locale);
      }
    }
  }
  return byLocale;
};

export const translateFileNames = (
  dict: { [k: string]: string },
  fileName: string
) => {
  // the keys are lowercase and sep by underscore
  const key = fileName.toLowerCase().split(" ").join("_");
  if (dict.hasOwnProperty(key)) return dict[key];
  return fileName;
};
