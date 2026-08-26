import type { DocSearchProps } from "@docsearch/react";

type AlgoliaConfig = Pick<DocSearchProps, "appId" | "apiKey"> & {
  indexName: string;
};

export const algolia: AlgoliaConfig = {
  apiKey: "d9a94568558345411f141246260ec0a4",
  indexName: "bedrock",
  appId: "QLWYANMOJF",
};
