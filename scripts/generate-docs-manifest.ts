import fs from "fs";
import path from "path";

import {
  COMPRESSED_VERSIONS_PATH,
  DOCS_MANIFEST_PATH,
} from "@lib/docs/constants";
import { compressVersions } from "@lib/versions/transform";

import { createDocsManifest } from "./lib/docs";

const main = () => {
  const file = createDocsManifest();

  // count the number of documentation files per locale
  for (const [locale, versions] of Object.entries(file["versions"])) {
    let count = 0;
    for (const [, minorVersions] of Object.entries(versions)) {
      // sum the number of files per version
      count += Object.values(minorVersions).reduce(
        (acc, files) => acc + files.length,
        0,
      );
    }
    console.log(`found ${count} ${locale.toUpperCase()} documentation files`);
  }

  const docsFile = path.resolve(DOCS_MANIFEST_PATH);
  fs.mkdirSync(path.dirname(docsFile), { recursive: true });

  fs.writeFileSync(docsFile, JSON.stringify(file));
  fs.mkdirSync(path.dirname(COMPRESSED_VERSIONS_PATH), { recursive: true });
  fs.writeFileSync(
    COMPRESSED_VERSIONS_PATH,
    JSON.stringify(
      Object.fromEntries(
        Object.entries(file.versions).map(([locale, versions]) => [
          locale,
          compressVersions(versions),
        ]),
      ),
    ),
  );
  console.log("static docs file generated!");
};

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
