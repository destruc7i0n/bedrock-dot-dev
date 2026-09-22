import { Glob } from "bun";
import { sep } from "path";

import { DOCS_SUBMODULE_PATH } from "@lib/docs/constants";
import { groupVersionsByLocale, Locale } from "@lib/i18n";
import type { BedrockVersions, BedrockVersionsFile } from "@lib/versions/types";

export function createDocsManifest(
  sourceDir = DOCS_SUBMODULE_PATH,
): BedrockVersionsFile {
  const versions: BedrockVersions = {};

  const paths = [
    ...new Glob("**/*.html").scanSync({
      cwd: sourceDir,
      dot: true,
    }),
  ];

  for (const path of paths.sort()) {
    const parts = path.split(sep);
    const file = parts.pop()!;
    if (!parts.length) continue;
    if (parts.length > 2) {
      throw new Error(`Unexpected docs path: ${path}`);
    }
    const [major, minor = major] = parts;
    versions[major] ??= {};
    versions[major][minor] ??= [];
    versions[major][minor].push(file.slice(0, -5));
  }

  if (!Object.keys(versions).length) {
    throw new Error(`No documentation found in ${sourceDir}`);
  }

  const manifest: BedrockVersionsFile = {
    versions: { [Locale.English]: versions },
    byLocale: {},
  };
  manifest.byLocale = groupVersionsByLocale(manifest);
  return manifest;
}
