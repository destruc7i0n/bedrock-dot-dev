import type { DocSearchProps } from "@docsearch/react";

type AlgoliaConfig = Pick<DocSearchProps, "appId" | "apiKey"> & {
  indexName: string;
};

export const algolia: AlgoliaConfig = {
  apiKey: "d9a94568558345411f141246260ec0a4",
  indexName: "bedrock",
  appId: "QLWYANMOJF",
};

// hosted mcp server, scoped read-only to the index above. no auth, algolia pays for it
export const ALGOLIA_MCP_URL =
  "https://QLWYANMOJF.algolia.net/mcp/1/RZ-zM1VTRZWEmIO3cJUdmw/mcp";

export const ALGOLIA_MCP_TOOL = `algolia_search_index_${algolia.indexName}`;
