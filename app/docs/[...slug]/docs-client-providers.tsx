"use client";

import { ReactNode, useMemo } from "react";
import { VersionContextProvider } from "components/version-context";
import { SidebarContextProvider } from "components/sidebar/sidebar-context";
import { TagsResponse } from "lib/tags";
import {
  transformInbound,
  TransformedOutbound,
} from "lib/bedrock-versions-transformer";

interface DocsClientProvidersProps {
  children: ReactNode;
  major: string;
  minor: string;
  file: string;
  versionsCompressed: TransformedOutbound;
  tags: TagsResponse;
}

export default function DocsClientProviders({
  children,
  major,
  minor,
  file,
  versionsCompressed,
  tags,
}: DocsClientProvidersProps) {
  // Decompress versions on client side to reduce RSC payload
  const versions = useMemo(
    () => transformInbound(versionsCompressed),
    [versionsCompressed],
  );

  return (
    <VersionContextProvider value={{ major, minor, file, versions, tags }}>
      <SidebarContextProvider>{children}</SidebarContextProvider>
    </VersionContextProvider>
  );
}
