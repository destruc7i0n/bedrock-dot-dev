import fs from "fs";
import path from "path";

import { DOCS_MANIFEST_PATH } from "@lib/docs/constants";

import { createDocsManifest } from "./lib/docs";

const main = async () => {
  const file = await createDocsManifest();

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
  console.log("static docs file generated!");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
