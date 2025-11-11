// fetch polyfill
import "isomorphic-unfetch";

import path from "path";
import fs from "fs";

import { getVersionsFile } from "../src/lib/versions";

const main = async () => {
  const file = await getVersionsFile();

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

  if (!fs.existsSync("public/static")) fs.mkdirSync("public/static");

  const docsFile = path.resolve("public/static/docs.json");

  fs.writeFileSync(docsFile, JSON.stringify(file));
  console.log("static docs file generated!");
};

main();
