import { createContext } from "react";
import { BedrockVersions } from "lib/versions";
import { Tags, TagsResponse } from "lib/tags";

export type VersionContextType = {
  major: string;
  minor: string;
  file: string;
  versions: BedrockVersions;
  tags: TagsResponse;
};

export const VersionContext = createContext<VersionContextType>({
  major: "",
  minor: "",
  file: "",
  versions: {},
  tags: { [Tags.Stable]: [], [Tags.Beta]: [] },
});
