import React from "react";
import type { FunctionComponent } from "react";
import { DocSearch as DocSearchComponent } from "@docsearch/react";
import type { DocSearchProps } from "@docsearch/react";
import cn from "classnames";
import { algolia } from "../../lib/algolia";

type Props = DocSearchProps & {
  fullWidth?: boolean;
  slim?: boolean;
  locale?: string;
  placeHolder?: string;
};

type HitComponentProps = {
  hit: { url: string };
  children: React.ReactNode;
};

const Hit = ({ hit, children }: HitComponentProps) => (
  <a href={hit.url}>{children}</a>
);

const DocSearch: FunctionComponent<Props> = ({
  fullWidth = false,
  slim = false,
  locale = "en",
  searchParameters,
  placeHolder = "Search",
  ...docSearchProps
}) => {
  const mergedSearchParameters: DocSearchProps["searchParameters"] = {
    facetFilters: [`lang:${locale}`],
    ...searchParameters,
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
        {...docSearchProps}
        placeholder={placeHolder}
        hitComponent={Hit}
        transformItems={(items) => {
          return items.map((item) => {
            // We transform the absolute URL into a relative URL
            const a = document.createElement("a");
            a.href = item.url;

            const hash = a.hash;

            return {
              ...item,
              url: `${a.pathname}${hash}`,
            };
          });
        }}
        searchParameters={mergedSearchParameters}
      />
    </div>
  );
};

export default DocSearch;
