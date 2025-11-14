import * as fs from "fs/promises";
import * as path from "path";

import { Locale } from "../i18n";
import { DOCS_SUBMODULE_PATH } from "./constants";

/**
 * Read a documentation HTML file from the bedrock-dev-docs submodule
 * @param filePath - Path in format "{major}/{minor}/{file}" (without .html extension)
 * @param locale - Locale (currently only English is supported)
 * @returns The HTML content of the file
 */
export async function getDocsFilesFromRepo(
  filePath: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _locale: Locale,
): Promise<string> {
  const submodulePath = path.resolve(process.cwd(), DOCS_SUBMODULE_PATH);

  // Construct the full path: bedrock-dev-docs/{major}/{minor}/{file}.html
  const fullPath = path.join(submodulePath, `${filePath}.html`);

  try {
    const content = await fs.readFile(fullPath, "utf-8");
    return content;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`Documentation file not found: ${filePath}.html`);
    }
    throw new Error(
      `Failed to read documentation file ${filePath}.html: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
