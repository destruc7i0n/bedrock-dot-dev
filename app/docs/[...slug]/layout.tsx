import { notFound } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";

import { VERCEL_URL } from "lib/constants";
import Log, { logLinkColor } from "lib/log";
import { getDocsData } from "./docs-data";
import DocsContainer from "components/docs/docs-container";
import Header from "components/docs/header";
import BackToTop from "components/docs/back-to-top";
import Footer from "components/footer";
import DocsClientProviders from "./docs-client-providers";

interface Props {
  params: Promise<{ slug: string[] }>;
}

// Use dynamic rendering to avoid RSC payload duplication in HTML
// This prevents the large HTML content from being embedded twice
export const dynamic = "force-dynamic";

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
}

export default async function DocsLayout({ params, sidebar }: LayoutProps) {
  const { slug } = await params;
  const data = await getDocsData(slug);

  if (!data) {
    notFound();
  }

  const { major, minor, file, versionsCompressed, tags } = data;

  Log.info(`Processing ${logLinkColor(file)}...`);

  return (
    <>
      <Script id="sidebar-load-script" strategy="beforeInteractive">
        {`
          try {
            var sidebar = window.localStorage.getItem('sidebar');
            if (sidebar) {
              var open = JSON.parse(sidebar).open;
              if (!open) document.documentElement.classList.add('sidebar-closed');
            }
          } catch (e) {}
        `}
      </Script>

      {/* Client components with context */}
      <DocsClientProviders
        major={major}
        minor={minor}
        file={file}
        versionsCompressed={versionsCompressed}
        tags={tags}
      >
        <Header />
      </DocsClientProviders>

      <div className="flex">
        {/* Sidebar from parallel route with context */}
        <DocsClientProviders
          major={major}
          minor={minor}
          file={file}
          versionsCompressed={versionsCompressed}
          tags={tags}
        >
          {sidebar}
        </DocsClientProviders>

        {/* Content - pure Server Component, completely independent */}
        <DocsContainer slug={slug} version={minor} file={file} />
      </div>

      {/* Footer components */}
      <BackToTop />
      <Footer
        dark
        darkClassName="bg-dark-gray-975"
        showToggles={false}
        outline
      />
    </>
  );
}
