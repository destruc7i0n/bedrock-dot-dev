import React, { FunctionComponent } from "react";
import Head from "next/head";

import { VERCEL_URL } from "lib/constants";

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

const Layout: FunctionComponent<Props> = ({
  children,
  title = "bedrock.dev",
  description = "",
}) => (
  <>
    <Head>
      <title>{title}</title>
      {description && (
        <>
          <meta name="description" content={description} />
          <meta name="og:description" content={description} />
        </>
      )}
      <meta property="og:title" content={title} />
      <meta key="meta-image" name="og:image" content={`${VERCEL_URL}/api/og`} />
    </Head>
    {children}
  </>
);

export default Layout;
