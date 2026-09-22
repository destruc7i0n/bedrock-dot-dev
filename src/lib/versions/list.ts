import { readFile } from "fs/promises";

import {
  COMPRESSED_VERSIONS_PATH,
  DOCS_MANIFEST_PATH,
} from "../docs/constants";
import type { Locale } from "../i18n";
import type { CompressedVersions } from "./transform";
import type { BedrockVersions, BedrockVersionsFile } from "./types";

// Cached for this process; restart development after adding or deleting docs.
let manifest: Promise<BedrockVersionsFile> | undefined;

export function readDocsManifest(): Promise<BedrockVersionsFile> {
  manifest ??= readFile(DOCS_MANIFEST_PATH, "utf-8")
    .then((fileContents) => JSON.parse(fileContents) as BedrockVersionsFile)
    .catch((error) => {
      manifest = undefined;
      throw new Error(
        "Could not read docs manifest. Run bun run dev or bun run build.",
        {
          cause: error,
        },
      );
    });
  return manifest;
}

export async function getVersions(locale: Locale): Promise<BedrockVersions> {
  return (await readDocsManifest()).versions[locale] ?? {};
}

let compressedVersions: Promise<Record<Locale, CompressedVersions>> | undefined;

export async function getCompressedVersions(
  locale: Locale,
): Promise<CompressedVersions> {
  compressedVersions ??= readFile(COMPRESSED_VERSIONS_PATH, "utf-8")
    .then(
      (contents) => JSON.parse(contents) as Record<Locale, CompressedVersions>,
    )
    .catch((error) => {
      compressedVersions = undefined;
      throw new Error(
        "Could not read compressed versions. Run bun run dev or bun run build.",
        { cause: error },
      );
    });
  return (await compressedVersions)[locale];
}
