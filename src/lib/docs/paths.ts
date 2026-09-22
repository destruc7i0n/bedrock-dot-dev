import { join } from "path";

import type { Locale } from "../i18n";
import { PROCESSED_DOCS_PATH } from "./constants";
import type { DocIdentity } from "./types";

export function getProcessedDocPath(
  doc: DocIdentity,
  locale: Locale,
  outputDir = PROCESSED_DOCS_PATH,
): string {
  return join(outputDir, locale, doc.major, doc.minor, `${doc.file}.json`);
}
