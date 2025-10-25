import { H1_MATCH, VERSION } from "../regex";

export type TitleResponse = {
  version: string;
  title: string;
};

const toTitleCase = (s: string) =>
  s
    .split(" ")
    .map((p) =>
      p === p.toUpperCase() && p.length < 4
        ? p
        : p[0].toUpperCase() + p.slice(1).toLowerCase()
    )
    .join(" ");
// .replace('Molang', 'MoLang') // custom name

export const getTitle = (html: string): TitleResponse => {
  const resp: TitleResponse = { version: "", title: "" };

  const h1 = html.match(H1_MATCH);
  if (!h1) return resp;

  // Clean and normalize the title
  const title = toTitleCase(h1[1].replace(/<\/?br>/g, "").trim());

  // Try old format: "TITLE Documentation Version: X.X.X.X"
  const withVersion = title.match(
    new RegExp(`(.*) Documentation Version: ${VERSION.source}`)
  );
  if (withVersion) {
    resp.title = withVersion[1];
    resp.version = withVersion[2];
    return resp;
  }

  // Try new format: "TITLE Documentation" (no version)
  const withoutVersion = title.match(/(.*) Documentation/);
  resp.title = withoutVersion ? withoutVersion[1] : title.replace(/ Documentation/i, "");

  return resp;
};
