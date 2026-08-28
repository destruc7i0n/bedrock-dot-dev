import { LIVE_URL } from "./constants/env";

const CONTEXT = "https://schema.org";

const SITE = {
  "@type": "WebSite",
  name: "bedrock.dev",
  url: LIVE_URL,
};

// the site operator. mojang is named as the source below, never as the operator
const PUBLISHER = {
  "@type": "Organization",
  name: "bedrock.dev",
  url: LIVE_URL,
};

const GAME = {
  "@type": "VideoGame",
  name: "Minecraft: Bedrock Edition",
  publisher: { "@type": "Organization", name: "Mojang Studios" },
};

export const websiteSchema = (description: string) => ({
  "@context": CONTEXT,
  ...SITE,
  description,
  inLanguage: "en",
  publisher: PUBLISHER,
  about: GAME,
});

export const docSchema = ({
  title,
  description,
  path,
  version,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  version: string;
  dateModified?: string;
}) => ({
  "@context": CONTEXT,
  "@type": "TechArticle",
  name: title,
  headline: title,
  description,
  url: `${LIVE_URL}${path}`,
  mainEntityOfPage: `${LIVE_URL}${path}`,
  inLanguage: "en",
  isPartOf: SITE,
  publisher: PUBLISHER,
  about: GAME,
  version,
  // only the real commit date of the source file, never a stand-in
  ...(dateModified ? { dateModified } : {}),
});

export const breadcrumbSchema = (trail: { name: string; path?: string }[]) => ({
  "@context": CONTEXT,
  "@type": "BreadcrumbList",
  // a listitem without an item invalidates the whole list, so a step with no
  // page of its own is left out rather than emitted bare
  itemListElement: trail
    .filter((crumb): crumb is { name: string; path: string } => !!crumb.path)
    .map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${LIVE_URL}${path}`,
    })),
});
