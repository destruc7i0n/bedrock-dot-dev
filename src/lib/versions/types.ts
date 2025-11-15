import type { BedrockVersionsByLocale, Locale } from "@lib/i18n";

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
