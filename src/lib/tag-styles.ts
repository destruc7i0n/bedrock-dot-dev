import { Tag } from "./types";

export const TAG_STYLES = {
  [Tag.Beta]: {
    border:
      "border border-yellow-500 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-600/10",
  },
  [Tag.Stable]: {
    border:
      "border border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-600/10",
  },
} as const;
