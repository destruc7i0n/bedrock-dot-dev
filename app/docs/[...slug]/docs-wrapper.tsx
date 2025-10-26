import Script from "next/script";
import { ReactNode } from "react";

import Header from "components/docs/header";
import BackToTop from "components/docs/back-to-top";
import Footer from "components/footer";
import DocsClientProviders from "./docs-client-providers";

import { TagsResponse } from "lib/tags";
import { TransformedOutbound } from "lib/bedrock-versions-transformer";

interface DocsWrapperProps {
  major: string;
  minor: string;
  file: string;
  versionsCompressed: TransformedOutbound;
  tags: TagsResponse;
  sidebarSlot: ReactNode;
  children: ReactNode;
}

export default function DocsWrapper({
  major,
  minor,
  file,
  versionsCompressed,
  tags,
  sidebarSlot,
  children,
}: DocsWrapperProps) {
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
        {/* Sidebar from parallel route - needs context */}
        <DocsClientProviders
          major={major}
          minor={minor}
          file={file}
          versionsCompressed={versionsCompressed}
          tags={tags}
        >
          {sidebarSlot}
        </DocsClientProviders>

        {/* Content rendered directly as Server Component - OUTSIDE client boundary! */}
        {children}
      </div>

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
