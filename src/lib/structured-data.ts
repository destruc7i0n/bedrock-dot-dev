import { LIVE_URL } from "./constants/env";

const CONTEXT = "https://schema.org";

const SITE = {
  "@type": "WebSite",
  name: "bedrock.dev",
  url: LIVE_URL,
};

export const websiteSchema = (description: string) => ({
  "@context": CONTEXT,
  ...SITE,
  description,
  inLanguage: "en",
});

export const docSchema = ({
  title,
  description,
  path,
  version,
}: {
  title: string;
  description: string;
  path: string;
  version: string;
}) => ({
  "@context": CONTEXT,
  "@type": "TechArticle",
  headline: title,
  description,
  url: `${LIVE_URL}${path}`,
  inLanguage: "en",
  isPartOf: SITE,
  about: { "@type": "VideoGame", name: "Minecraft: Bedrock Edition" },
  version,
});

export const breadcrumbSchema = (trail: { name: string; path?: string }[]) => ({
  "@context": CONTEXT,
  "@type": "BreadcrumbList",
  itemListElement: trail.map(({ name, path }, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    ...(path ? { item: `${LIVE_URL}${path}` } : {}),
  })),
});
