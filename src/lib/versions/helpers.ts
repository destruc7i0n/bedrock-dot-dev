import type { BedrockVersions } from "./types";

export const areVersionsEqual = (a: string[], b: string[]) =>
  a[0] === b[0] && a[1] === b[1];

export const getVersionParts = (version: string): number[] =>
  version.split(".").map(Number);

export function compareBedrockVersions(a: string, b: string) {
  const sa = getVersionParts(a);
  const sb = getVersionParts(b);
  for (let i = 0; i < 4; i++) {
    const na = sa[i];
    const nb = sb[i];
    if (na > nb) return -1;
    if (nb > na) return 1;
  }
  return 0;
}

// helper generator to sort and loop through all bedrock versions
export function* bedrockVersionsInOrder(
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
