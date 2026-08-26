import * as fs from "fs";
import * as path from "path";

export const LASTMOD_FILE_PATH = "data/generated/lastmod.json";

export type LastModified = Record<string, string>;

let cached: LastModified | undefined;

// when each source file last changed, keyed by major/minor/file.html. empty when
// the history is unavailable, and pages then omit dateModified rather than guess
export const getLastModified = (): LastModified => {
  if (cached) return cached;

  try {
    const file = path.resolve(process.cwd(), LASTMOD_FILE_PATH);
    cached = JSON.parse(fs.readFileSync(file, "utf-8")) as LastModified;
  } catch {
    cached = {};
  }

  return cached;
};

export const lastModifiedFor = (
  dates: LastModified,
  major: string,
  minor: string,
  file: string,
) => dates[`${major}/${minor}/${file}.html`];
