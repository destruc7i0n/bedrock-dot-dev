import type { Heading } from "@lib/html/scrape/headings";

import { LIVE_URL } from "./constants/env";
import { t } from "./i18n";
import { Tag } from "./types";

export type DocChannel = {
  // null for a version that is neither current stable nor beta
  tag: Tag | null;
  version: string;
  major: string;
  minor: string;
};

const fill = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );

const SUFFIX = " | bedrock.dev";

export const getCanonicalUrl = (pathname: string) => `${LIVE_URL}${pathname}`;

// the homepage chooser reads this and lists that version's files
export const versionPath = ({ major, minor }: DocChannel) =>
  `/?r=${major}/${minor}`;

const byTag = <T>(tag: Tag | null, stable: T, beta: T, version: T) =>
  tag === Tag.Stable ? stable : tag === Tag.Beta ? beta : version;

// the document name leads so the distinctive word comes first. stable and beta
// leave the version out, since a title that churns every release loses its rank
export const getDocumentTitle = ({
  name,
  channel,
}: {
  name: string;
  channel: DocChannel;
}) => {
  const key = byTag(channel.tag, "title_stable", "title_beta", "title_version");
  return (
    fill(t(`page.docs.${key}`), { title: name, version: channel.version }) +
    SUFFIX
  );
};

// tuning for the generated description
const LIMITS = {
  named: 3, // sections named before "and N more"
  length: 160, // google truncates a snippet around here
  title: 40, // longer than this reads as prose, not a heading
};

const BOILERPLATE = new Set([
  "index",
  "overview",
  "introduction",
  "json format",
  "contents",
  "about",
  "description",
  "example",
  "examples",
  "notes",
]);

// a contents row can be a whole sentence, which makes a poor snippet
const isProse = (title: string) =>
  title.length > LIMITS.title || /[.?!]$/.test(title);

// the sections worth naming, most prominent first. mojang numbers its headings
// by weight, so an <h1> section outranks an <h2> one, and ties keep document order
const rankSections = (headings: Heading[]) => {
  const seen = new Set<string>();

  const usable = headings.filter(({ title }) => {
    const key = title.toLowerCase();
    if (seen.has(key) || BOILERPLATE.has(key) || isProse(title)) return false;
    seen.add(key);
    return true;
  });

  const ranked = usable
    .map((heading, index) => ({ ...heading, index }))
    .sort((a, b) => a.level - b.level || a.index - b.index)
    .slice(0, LIMITS.named)
    .map(({ title }) => title);

  return { ranked, remaining: Math.max(usable.length - ranked.length, 0) };
};

export const getDocumentDescription = ({
  name,
  channel,
  headings,
}: {
  name: string;
  channel: DocChannel;
  headings: Heading[];
}) => {
  const channelKey = byTag(
    channel.tag,
    "channel_stable",
    "channel_beta",
    "channel_version",
  );
  const channelPhrase = fill(t(`page.docs.${channelKey}`), {
    version: channel.version,
  });

  const { ranked, remaining } = rankSections(headings);

  const plain = fill(t("page.docs.description"), {
    title: name,
    channel: channelPhrase,
  });

  // drop the least important section until it fits, so the list gives way and
  // never the sentence that names the version
  for (let count = ranked.length; count > 0; count--) {
    const named = ranked.slice(0, count);
    const left = remaining + (ranked.length - count);
    const list = named.join(", ");

    const sections = left
      ? fill(
          t(`page.docs.${left === 1 ? "sections_more_one" : "sections_more"}`),
          {
            sections: list,
            count: left,
          },
        )
      : list;

    const description = fill(t("page.docs.description_sections"), {
      title: name,
      channel: channelPhrase,
      sections,
    });

    if (description.length <= LIMITS.length) return description;
  }

  return plain;
};

export type Crumb = { name: string; path?: string };

// mirrors the url. the product name is in the title and json-ld already
export const getBreadcrumbTrail = ({
  name,
  channel,
}: {
  name: string;
  channel: DocChannel;
}): Crumb[] => {
  const { major, minor } = channel;

  // the major has no page of its own, so only the minor links out
  const version: Crumb[] =
    major === minor
      ? [{ name: major, path: versionPath(channel) }]
      : [{ name: major }, { name: minor, path: versionPath(channel) }];

  return [{ name: "bedrock.dev", path: "/" }, ...version, { name }];
};
