import { Tags } from "./tags";

export const TAG_STYLES = {
  [Tags.Beta]: {
    border:
      "border-2 border-yellow-500 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-600/10",
  },
  [Tags.Stable]: {
    border:
      "border-2 border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-600/10",
  },
} as const;
