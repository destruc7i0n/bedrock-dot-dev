import type { BedrockVersions } from "./versions";
import { getVersionParts } from "./util";
import { bedrockVersionsInOrder } from "./versions";

export interface CompressedVersions {
  k: string[]; // key: unique file names
  v: [number[], number[]][]; // versions: [[version parts], [file indices]]
}

export const decompressVersions = (
  data: CompressedVersions,
): BedrockVersions => {
  const versions: BedrockVersions = {};

  for (const [versionParts, fileIndices] of data.v) {
    const major = `${versionParts[0]}.${versionParts[1]}.0.0`;
    const minor = versionParts.join(".");

    if (!versions[major]) versions[major] = {};
    versions[major][minor] = fileIndices.map((i) => data.k[i]);
  }

  return versions;
};

// Compression strategy:
// 1. Create a lookup table of unique file names
// 2. Convert version strings to number arrays
// 3. Replace file names with indices
export const compressVersions = (data: BedrockVersions): CompressedVersions => {
  const out: CompressedVersions = { k: [], v: [] };
  const fileIndexMap = new Map<string, number>();

  for (const [, minor, files] of bedrockVersionsInOrder(data)) {
    const versionParts = getVersionParts(minor);

    const fileIndices: number[] = [];
    for (const file of files) {
      if (!fileIndexMap.has(file)) {
        out.k.push(file);
        fileIndexMap.set(file, out.k.length);
      }
      fileIndices.push(fileIndexMap.get(file)!);
    }

    out.v.push([versionParts, fileIndices]);
  }

  return out;
};
