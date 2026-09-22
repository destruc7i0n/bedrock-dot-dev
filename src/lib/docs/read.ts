import { readFile } from "fs/promises";
import { join } from "path";

import type { Locale } from "../i18n";
import { DOCS_SUBMODULE_PATH, PROCESSED_DOCS_PATH } from "./constants";
import { getProcessedDocPath } from "./paths";
import type { DocIdentity, ProcessedDoc } from "./types";

export async function readDocSource(
  { major, minor, file }: DocIdentity,
  sourceDir = DOCS_SUBMODULE_PATH,
): Promise<string> {
  try {
    return await readFile(
      join(sourceDir, major, minor, `${file}.html`),
      "utf-8",
    );
  } catch (error) {
    if (
      major === minor &&
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      // Older docs stored files directly under the major version.
      return readFile(join(sourceDir, major, `${file}.html`), "utf-8");
    }
    throw error;
  }
}

export async function readProcessedDoc(
  doc: DocIdentity,
  locale: Locale,
  outputDir = PROCESSED_DOCS_PATH,
): Promise<ProcessedDoc> {
  const filePath = getProcessedDocPath(doc, locale, outputDir);

  try {
    const processed: ProcessedDoc = JSON.parse(
      await readFile(filePath, "utf-8"),
    );
    if (
      processed.major !== doc.major ||
      processed.minor !== doc.minor ||
      processed.file !== doc.file ||
      typeof processed.html !== "string" ||
      !Array.isArray(processed.headings) ||
      !processed.sidebar ||
      typeof processed.sidebar !== "object" ||
      !processed.title ||
      typeof processed.title !== "object"
    ) {
      throw new Error("Invalid processed document");
    }
    return processed;
  } catch (error) {
    throw new Error(
      `Could not read ${filePath}. Run bun run build to generate docs.`,
      {
        cause: error,
      },
    );
  }
}
