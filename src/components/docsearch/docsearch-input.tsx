import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { DocSearchModal, useDocSearchKeyboardEvents } from "@docsearch/react";
import type { DocSearchModalProps } from "@docsearch/react";

import { algolia } from "../../lib/algolia";
import DocSearchButton from "./docsearch-button";

type Props = {
  placeHolder?: string;
  xl?: boolean;
  locale?: string;
};

const DocSearchInput: React.FC<Props> = ({
  placeHolder = "Search",
  xl = false,
  locale = "en",
}) => {
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>(
    undefined,
  );

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
    setInitialQuery(undefined);
  }, []);

  const onInput = useCallback((event: KeyboardEvent) => {
    setIsOpen(true);
    setInitialQuery(event.key);
  }, []);

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  const searchParameters: DocSearchModalProps["searchParameters"] = {
    facetFilters: [`lang:${locale}`],
  };

  return (
    <>
      <DocSearchButton
        ref={searchButtonRef}
        xl={xl}
        placeHolder={placeHolder}
        onClick={onOpen}
      />

      {isOpen &&
        createPortal(
          <DocSearchModal
            {...algolia}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            onClose={onClose}
            searchParameters={searchParameters}
            transformItems={(items) => {
              return items.map((item) => {
                // Transform absolute URL into relative URL
                const a = document.createElement("a");
                a.href = item.url;
                const hash = a.hash;

                return {
                  ...item,
                  url: `${a.pathname}${hash}`,
                };
              });
            }}
            hitComponent={({ hit, children }) => (
              <a href={hit.url}>{children}</a>
            )}
          />,
          document.body,
        )}
    </>
  );
};

export default DocSearchInput;
