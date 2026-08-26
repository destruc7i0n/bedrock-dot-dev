import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

import { DOCS_SUBMODULE_PATH } from "@lib/docs/constants";
import { LASTMOD_FILE_PATH } from "@lib/docs/lastmod";

const submodule = path.resolve(process.cwd(), DOCS_SUBMODULE_PATH);

const git = (args: string[]) =>
  execFileSync("git", ["-c", "core.quotePath=false", ...args], {
    cwd: submodule,
    encoding: "utf-8",
    maxBuffer: 256 * 1024 * 1024,
  }).trim();

// when each file last changed, so pages carry a real dateModified. a shallow
// checkout would date everything to the clone day, so that writes an empty map
const main = () => {
  const out = path.resolve(process.cwd(), LASTMOD_FILE_PATH);
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const dates: Record<string, string> = {};

  try {
    if (git(["rev-parse", "--is-shallow-repository"]) === "true") {
      console.log("docs submodule is shallow, skipping lastmod");
    } else {
      // one walk of the history, newest commit first, so the first time a path
      // shows up is the last time it changed
      const log = git(["log", "--format=%cI", "--name-only", "--no-renames"]);

      let date = "";
      for (const line of log.split("\n")) {
        const value = line.trim();
        if (!value) continue;
        if (/^\d{4}-\d{2}-\d{2}T/.test(value)) date = value;
        else if (value.endsWith(".html") && date && !dates[value])
          dates[value] = date;
      }
    }
  } catch (error) {
    console.warn(
      `could not read the docs history: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  fs.writeFileSync(out, JSON.stringify(dates));
  console.log(
    `lastmod.json generated with ${Object.keys(dates).length} files!`,
  );
};

main();
