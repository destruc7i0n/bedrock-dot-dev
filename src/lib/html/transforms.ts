import { cleanHtmlForDisplay } from "./clean";
import { highlightHtml } from "./highlight";
import { TEXTAREA_MATCH } from "./regex";

export type DocMeta = { major: string; minor: string; file: string };

export type DocTransform = (html: string, doc: DocMeta) => string;

const clean =
  (anchors: boolean): DocTransform =>
  (html, { file, minor }) =>
    cleanHtmlForDisplay(html, file, minor, { anchors });

const highlight: DocTransform = (html, { file }) => highlightHtml(html, file);

// the docs are mostly html tables, so drop the presentation attributes and
// fence the samples instead of shipping megabytes of markup
const PRESENTATION_ATTRS =
  /\s(?:style|border|cols|rows|readonly|bgcolor|align|valign|width|height|cellpadding|cellspacing)="[^"]*"/g;

const slim: DocTransform = (html) =>
  html
    .replace(
      TEXTAREA_MATCH,
      (_, body: string) => `\n\n\`\`\`json\n${body.trim()}\n\`\`\`\n\n`,
    )
    .replace(PRESENTATION_ATTRS, "");

export const DISPLAY_TRANSFORMS: DocTransform[] = [clean(true), highlight];

// the same pipeline without the steps that only matter on the rendered page
export const MARKDOWN_TRANSFORMS: DocTransform[] = [clean(false), slim];

export const applyTransforms = (
  html: string,
  doc: DocMeta,
  transforms: DocTransform[],
) => transforms.reduce((acc, transform) => transform(acc, doc), html);
