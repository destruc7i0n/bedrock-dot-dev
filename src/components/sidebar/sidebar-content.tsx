import { memo, useEffect, useRef, useState } from "react";
import type { FunctionComponent } from "react";

import type { SidebarStructure } from "./index";
import SidebarGroupTitle from "./sidebar-group-title";
import SidebarGroupItem from "./sidebar-group-item";

type Props = {
  sidebar: SidebarStructure;
  file: string;
};

type SidebarContentState = {
  [key: string]: boolean;
};

// Sidebar configuration constants
const SIDEBAR_SCROLL_OFFSET = 164; // Header + padding height
const COLLAPSED_BY_DEFAULT_PAGES = ["Entities"];

// initially open or closed state for the sidebar
const getInitialOpen = (sidebar: SidebarStructure, file: string) => {
  const state: SidebarContentState = {};
  for (const { header } of Object.values(sidebar)) {
    // by default open on all pages other than the entities page
    state[header.id] = !COLLAPSED_BY_DEFAULT_PAGES.includes(file);
  }
  return state;
};

const SidebarContent: FunctionComponent<Props> = ({ sidebar, file }) => {
  const [mounted, setMounted] = useState(false);
  const [hash, setHash] = useState("");
  const [open, setOpen] = useState<SidebarContentState>(
    getInitialOpen(sidebar, file),
  );
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHash("");
    setOpen(getInitialOpen(sidebar, file));
  }, [file, sidebar]);

  // open on page load if the heading is closed for the item in the hash
  useEffect(() => {
    if (location.hash) {
      const hash = decodeURIComponent(location.hash);
      setHash(hash);
      const hashId = hash.substring(1);
      // if there is a hash open the heading which contains the hash on load
      const heading = Object.values(sidebar).find((value) =>
        value.elements.find((el) => el.id === hashId),
      );
      if (heading && !open[heading.header.id]) {
        setHeadingOpen(heading.header.id, true);
      }
    }
    setMounted(true);

    // store the hash for re-render
    const onHashChange = () => {
      const decoded = decodeURIComponent(location.hash);
      setHash(decoded);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // run after mount to scroll to the hash
  // since the group might be closed
  useEffect(() => {
    // automatically scroll to the hash in the sidebar on page load
    if (hash) {
      const el: HTMLAnchorElement | null = document.querySelector(
        `.sidebar .sidebar-id[href="#${encodeURIComponent(
          hash.replace("#", ""),
        )}"]`,
      );
      if (el) {
        if (sidebarRef.current) {
          sidebarRef.current.scrollTop = el.offsetTop - SIDEBAR_SCROLL_OFFSET;
        }
      }
    }
  }, [hash, mounted]);

  // helper method to update the state
  const setHeadingOpen = (heading: string, value: boolean) => {
    if (open[heading] === value) return;
    setOpen((prev) => ({
      ...prev,
      [heading]: value,
    }));
  };

  return (
    <div
      className="content flex flex-1 flex-col overflow-y-auto overscroll-contain pb-48 md:pb-8"
      ref={sidebarRef}
    >
      {Object.values(sidebar).map((value, index) => {
        const { header, elements } = value;
        return (
          <SidebarGroupTitle
            key={`${file}-title-${index}`}
            open={open[header.id]}
            onToggle={(isOpen) => setHeadingOpen(header.id, isOpen)}
            title={header.title}
            id={header.id}
            hash={hash}
          >
            {elements.map((item, index) => (
              <SidebarGroupItem
                key={`${file}-item-${index}-${item.id}`}
                id={item.id}
                title={item.title}
                hash={hash}
                // keep the header containing this one open on click
                onClick={() => setHeadingOpen(header.id, true)}
              />
            ))}
          </SidebarGroupTitle>
        );
      })}
    </div>
  );
};

export default memo(SidebarContent);
