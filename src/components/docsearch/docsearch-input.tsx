import React, { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import type { DocSearchTheme } from "@docsearch/react";
import type { DocSearchModalProps } from "@docsearch/react/modal";
import { DocSearchModal } from "@docsearch/react/modal";
import { useDocSearchKeyboardEvents } from "@docsearch/react/useDocSearchKeyboardEvents";

import { algolia } from "@lib/constants/algolia";

import DocSearchButton from "./docsearch-button";

type Props = {
  placeHolder?: string;
  size?: "sm" | "md" | "lg";
  locale?: string;
};

// the modal reads the theme off data-theme, the site off a class
const currentTheme = (): DocSearchTheme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const noop = () => {};

const DocSearchInput: React.FC<Props> = ({
  placeHolder = "Search",
  size = "md",
  locale = "en",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<DocSearchTheme>("light");
  const [initialQuery, setInitialQuery] = useState<string | undefined>(
    undefined,
  );

  const onOpen = useCallback(() => {
    setTheme(currentTheme());
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
    setInitialQuery(undefined);
  }, []);

  // the keyboard hook dropped onInput, so type-to-search lives here now
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!/^[a-zA-Z0-9]$/.test(event.key)) return;

      event.preventDefault();
      setInitialQuery(event.key);
      onOpen();
    },
    [onOpen],
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    isAskAiActive: false,
    onAskAiToggle: noop,
  });

  const indices: DocSearchModalProps["indices"] = useMemo(
    () => [
      {
        name: algolia.indexName,
        searchParameters: { facetFilters: [`lang:${locale}`] },
      },
    ],
    [locale],
  );

  return (
    <>
      <DocSearchButton
        size={size}
        placeHolder={placeHolder}
        onClick={onOpen}
        onKeyDown={onKeyDown}
      />

      {isOpen &&
        createPortal(
          <DocSearchModal
            appId={algolia.appId}
            apiKey={algolia.apiKey}
            indices={indices}
            theme={theme}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            onClose={onClose}
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
