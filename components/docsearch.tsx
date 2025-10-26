"use client";

import React, { FunctionComponent } from "react";

import Link from "next/link";

import { useTranslations } from "next-intl";

import {
  DocSearch as DocSearchComponent,
  DocSearchProps,
} from "@docsearch/react";

import cn from "classnames";

import { Locale } from "lib/i18n";

type Props = {
  placeHolder?: string;
  fullWidth?: boolean;
  slim?: boolean;
  locale?: Locale;
};

export const algolia: DocSearchProps = {
  apiKey: "d9a94568558345411f141246260ec0a4",
  indexName: "bedrock",
  appId: "QLWYANMOJF",
};

// export const algolia: DocSearchProps = {
//   apiKey: '6276b927975d54b2c2b16337054f38fb',
//   indexName: 'bedrock',
//   appId: 'BH4D9OD16A',
// }

type HitComponentProps = {
  hit: { url: string };
  children: React.ReactNode;
};

const Hit = ({ hit, children }: HitComponentProps) => (
  <Link href={hit.url}>{children}</Link>
);

const DocSearch: FunctionComponent<Props> = ({
  placeHolder,
  fullWidth = false,
  slim = false,
  locale = Locale.English,
}) => {
  const t = useTranslations("component.search");
  if (!placeHolder) placeHolder = t("title");

  const searchParameters: DocSearchProps["searchParameters"] = {
    facetFilters: [`lang:${locale}`],
  };

  return (
    <div
      className={cn("docsearch-wrapper", {
        "full-width w-full": fullWidth,
        slim: slim,
      })}
    >
      <DocSearchComponent
        {...algolia}
        placeholder={placeHolder}
        hitComponent={Hit}
        transformItems={(items) => {
          return items.map((item) => {
            // We transform the absolute URL into a relative URL to
            // leverage Next's preloading.
            const a = document.createElement("a");
            a.href = item.url;

            const hash = a.hash;

            return {
              ...item,
              url: `${a.pathname}${hash}`,
            };
          });
        }}
        searchParameters={searchParameters}
      />
    </div>
  );
};

export default DocSearch;
