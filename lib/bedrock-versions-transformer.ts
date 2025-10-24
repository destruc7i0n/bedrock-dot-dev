import { BedrockVersions } from "./versions";

import { compareBedrockVersions, getVersionParts } from "./util";

export interface TransformedOutbound {
  key: string[];
  versions: [
    number[], // the minecraft version
    number[], // the files
  ][];
}

// helper generator to sort and loop through all bedrock versions
function* bedrockVersionsInOrder(
  versions: BedrockVersions,
): IterableIterator<[string, string, string[]]> {
  const majorVersions = Object.keys(versions).sort(compareBedrockVersions);
  for (const major of majorVersions) {
    const minorVersions = Object.keys(versions[major]).sort(
      compareBedrockVersions,
    );
    for (const minor of minorVersions) {
      const files = versions[major][minor];
      yield [major, minor, files];
    }
  }
}

const transformInbound = (data: TransformedOutbound) => {
  const versions: BedrockVersions = {};

  for (const version of data.versions) {
    const major = [version[0][0], version[0][1], 0, 0].join(".");
    const minor = version[0].join(".");

    if (!versions[major]) versions[major] = {};
    if (!versions[major][minor]) versions[major][minor] = [];

    versions[major][minor] = version[1].map((i) => data.key[i]);
  }

  return versions;
};

// transform versions to
// [ [ ...minecraft version... ], [ ...file indices... ] ]
const transformOutbound = (data: BedrockVersions) => {
  const out: TransformedOutbound = { key: [], versions: [] };
  const fileIndexMap = new Map<string, number>();

  for (const [major, minor] of bedrockVersionsInOrder(data)) {
    const version = getVersionParts(minor);

    const map = [];
    for (const file of data[major][minor]) {
      let fileIndex = fileIndexMap.get(file);
      if (fileIndex === undefined) {
        fileIndex = out.key.length;
        out.key.push(file);
        fileIndexMap.set(file, fileIndex);
      }
      map.push(fileIndex);
    }

    out.versions.push([version, map]);
  }

  return out;
};

export { transformInbound, transformOutbound, bedrockVersionsInOrder };
