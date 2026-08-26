import { HEADING_MATCH } from "../regex";

export type Heading = { level: number; title: string };

// mojang numbers headings by weight, so the level says how prominent a section
// is. used to order the sections named in the page description
export const getHeadings = (html: string): Heading[] => {
  const headings: Heading[] = [];
  const all = new RegExp(HEADING_MATCH.source, "g");

  for (const [, level, body] of html.matchAll(all)) {
    const title = body.replace(/<[^>]+>/g, "").trim();
    if (title) headings.push({ level: Number(level), title });
  }

  // the first one is the document title, not a section of it
  return headings.slice(1);
};
