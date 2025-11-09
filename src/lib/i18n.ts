import i18next from "i18next";
import en from "../locales/en/common.json";
import { BedrockVersionsFile } from "./versions";

export enum Locale {
  English = "en",
}

const DEFAULT_LOCALE = Locale.English;

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

let initialized = false;

export const initI18n = async () => {
  if (!initialized) {
    await i18next.init({
      lng: DEFAULT_LOCALE,
      fallbackLng: DEFAULT_LOCALE,
      defaultNS: "common",
      resources: {
        [DEFAULT_LOCALE]: {
          common: en,
        },
      },
      interpolation: {
        escapeValue: false,
      },
    });
    initialized = true;
  }
};

export const t = (key: string) => {
  if (!initialized || !i18next.isInitialized) {
    console.warn(`i18next not initialized when translating key: ${key}`);
    return key;
  }
  return i18next.t(key);
};
