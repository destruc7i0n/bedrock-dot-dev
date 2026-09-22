import { extractDataFromHtml } from "../html";
import type { DocTransform } from "../html/transforms";
import { applyTransforms, DISPLAY_TRANSFORMS } from "../html/transforms";
import type { DocIdentity, ProcessedDoc } from "./types";

export function processDoc(
  html: string,
  doc: DocIdentity,
  transforms: DocTransform[] = DISPLAY_TRANSFORMS,
): ProcessedDoc {
  const output = applyTransforms(html, doc, transforms);
  const { sidebar, title, headings } = extractDataFromHtml(html, doc.file);

  return {
    ...doc,
    html: output,
    sidebar,
    title,
    headings,
  };
}
