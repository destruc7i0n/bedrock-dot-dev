import { getDocsFilesFromRepo } from "../docs/files";
import { Locale } from "../i18n";
import Log from "../log";
import type { DocTransform } from "./transforms";
import { applyTransforms, DISPLAY_TRANSFORMS } from "./transforms";

const fetchHtml = async (
  version: string[],
  locale: Locale,
  transforms: DocTransform[] = DISPLAY_TRANSFORMS,
) => {
  const [major, minor, file] = version;
  const path = version.join("/");

  let html: string;

  try {
    html = await getDocsFilesFromRepo(path, locale);
  } catch {
    Log.error(`Could not get file for "${path}"!`);
    return null;
  }

  return {
    html,
    output: applyTransforms(html, { major, minor, file }, transforms),
  };
};

export default fetchHtml;
