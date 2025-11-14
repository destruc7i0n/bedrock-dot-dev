import type { TagsResponse } from "@lib/types";
import { Tag } from "@lib/types";
import { areVersionsEqual } from "@lib/versions/helpers";

export const getVersionTag = (
  version: string[],
  tags: TagsResponse,
): Tag | null => {
  if (areVersionsEqual(version, tags.stable)) {
    return Tag.Stable;
  }
  if (areVersionsEqual(version, tags.beta)) {
    return Tag.Beta;
  }
  return null;
};
