import { notFound } from "next/navigation";
import { Metadata } from "next";

import { allFilesList } from "lib/versions";
import { getTags, Tags } from "lib/tags";
import { Locale } from "lib/i18n";
import { bedrockVersionsInOrder } from "lib/bedrock-versions-transformer";
import { getVersionParts, areVersionsEqual } from "lib/util";
import { VERCEL_URL } from "lib/constants";
import Log, { logLinkColor } from "lib/log";
import DocsWrapper from "./docs-wrapper";
import { getDocsData } from "./docs-data";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = [];
  const locale = Locale.English;
  const bedrockVersions = await allFilesList(locale);
  const tags = await getTags(locale);

  const stableVersionParts = getVersionParts(tags[Tags.Stable][1]);
  const [, stableMajor, stableMinor] = stableVersionParts;

  for (const [major, minor, files] of bedrockVersionsInOrder(bedrockVersions)) {
    for (const file of files) {
      const version = [major, minor];
      const versionParts = getVersionParts(minor);
      const [, verMajor, verMinor] = versionParts;

      let shouldPreload = false;
      if (verMajor >= stableMajor) {
        if (verMajor === stableMajor) {
          shouldPreload = verMinor >= stableMinor;
        } else {
          shouldPreload = true;
        }
      }

      if (areVersionsEqual(version, tags[Tags.Stable])) {
        paths.push({ slug: ["stable", file] });
        shouldPreload = true;
      } else if (areVersionsEqual(version, tags[Tags.Beta])) {
        paths.push({ slug: ["beta", file] });
        shouldPreload = true;
      }

      if (shouldPreload) {
        paths.push({ slug: [major, minor, file] });
      }
    }
  }

  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDocsData(slug);

  if (!data) {
    return { title: "Not Found" };
  }

  const { file, minor, versionTag, titleData } = data;
  const { title: documentTitle, version: htmlVersion } = titleData || {};

  const pageVersion = htmlVersion || minor;
  const pageTitle = documentTitle || file || "Documentation";

  let title = `${pageTitle} ${pageVersion} | bedrock.dev`;
  let description = `Documentation for ${pageTitle} in version ${pageVersion}`;

  if (versionTag === "stable") {
    title = `${pageTitle} (Stable) | bedrock.dev`;
    description = `Stable documentation for ${pageTitle}`;
  } else if (versionTag === "beta") {
    title = `${pageTitle} (Beta) | bedrock.dev`;
    description = `Beta documentation for ${pageTitle}`;
  }

  const versionParam = versionTag || pageVersion;
  const ogImageUrl = `${VERCEL_URL}/api/og?file=${encodeURIComponent(file)}&version=${encodeURIComponent(versionParam)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

interface LayoutProps {
  params: Promise<{ slug: string[] }>;
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export default async function DocsLayout({
  params,
  sidebar,
  content,
}: LayoutProps) {
  const { slug } = await params;
  const data = await getDocsData(slug);

  if (!data) {
    notFound();
  }

  const { major, minor, file, versionsCompressed, tags } = data;

  Log.info(`Processing ${logLinkColor(file)}...`);

  return (
    <DocsWrapper
      major={major}
      minor={minor}
      file={file}
      versionsCompressed={versionsCompressed}
      tags={tags}
      sidebarSlot={sidebar}
    >
      {content}
    </DocsWrapper>
  );
}
