import { readdir } from "fs/promises";
import { join } from "path";

import { DOCS_SUBMODULE_PATH } from "@lib/docs/constants";
import { groupVersionsByLocale, Locale } from "@lib/i18n";
import type { BedrockVersions, BedrockVersionsFile } from "@lib/versions/types";

export async function createDocsManifest(
  sourceDir = DOCS_SUBMODULE_PATH,
): Promise<BedrockVersionsFile> {
  const versions: BedrockVersions = {};

  const scan = async (parts: string[] = []): Promise<void> => {
    const entries = await readdir(join(sourceDir, ...parts), {
      withFileTypes: true,
    });
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await scan([...parts, entry.name]);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".html") &&
        parts.length
      ) {
        if (parts.length > 2) {
          throw new Error(
            `Unexpected docs path: ${[...parts, entry.name].join("/")}`,
          );
        }
        const [major, minor = major] = parts;
        versions[major] ??= {};
        versions[major][minor] ??= [];
        versions[major][minor].push(entry.name.slice(0, -5));
      }
    }
  };

  await scan();
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
