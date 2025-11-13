import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/common.json";
import type { BedrockVersionsFile } from "@lib/versions/types";

export enum Locale {
  English = "en",
}

type RepositoryData = {
  [key in Locale]: {
    name: string;
    tag: string;
  };
};

const REPOSITORIES: RepositoryData = {
  [Locale.English]: {
    name: "bedrock-dot-dev/docs",
    tag: "master",
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getLocale = (_locale?: string): Locale => {
  // Currently only English is supported
  // Add more cases here when more locales are added
  return Locale.English;
};

export const getRepository = (locale: Locale) => {
  if (Object.keys(REPOSITORIES).includes(locale)) return REPOSITORIES[locale];
  return REPOSITORIES[Locale.English];
};

export interface BedrockVersionsByLocale {
  [key: string]: Locale[];
}

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

if (!i18next.isInitialized) {
  i18next.use(initReactI18next);
  i18next.init(
    {
      lng: Locale.English,
      fallbackLng: Locale.English,
      defaultNS: "common",
      resources: {
        [Locale.English]: {
          common: en,
        },
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      initAsync: false,
    },
    (err) => {
      if (err) {
        console.error("i18next initialization error:", err);
      }
    },
  );
}

export const t = (key: string) => {
  return i18next.t(key);
};
