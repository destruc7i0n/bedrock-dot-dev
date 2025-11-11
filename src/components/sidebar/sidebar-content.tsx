import { FunctionComponent, memo, useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { sidebarFilter } from "@stores/sidebar-filter";

import { SidebarStructure } from "./index";
import SidebarGroupTitle from "./sidebar-group-title";
import SidebarGroupItem from "./sidebar-group-item";

type Props = {
  sidebar: SidebarStructure;
  file: string;
};

type SidebarContentState = {
  [key: string]: boolean;
};

// initially open or closed state for the sidebar
const getInitialOpen = (sidebar: SidebarStructure, file: string) => {
  const state: SidebarContentState = {};
  for (const { header } of Object.values(sidebar)) {
    // be default open on all pages other than the entities page
    state[header.id] = file !== "Entities";
  }
  return state;
};

const SidebarContent: FunctionComponent<Props> = ({ sidebar, file }) => {
  const $filter = useStore(sidebarFilter);
  let search = $filter;

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
      // if there is a hash open the heading which contains the hash on load
      const heading = Object.keys(sidebar).find((h) =>
        sidebar[h].elements.find((el) => el.id === hash.substring(1)),
      );
      if (heading && !open[heading]) setHeadingOpen(heading, true);
    }
    setMounted(true);

    // store the hash for re-render
    const onHashChange = () => {
      const decoded = decodeURIComponent(location.hash);
      setHash(decoded);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount for hash initialization

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
          sidebarRef.current.scrollTop = el.offsetTop - 164;
        }
      }
    }
  }, [hash, mounted]);

  // filter if filtering
  if (search) {
    const filteredSidebar: SidebarStructure = {};

    search = search.toLowerCase();

    const keys = Object.keys(sidebar);
    for (const key of keys) {
      const el = sidebar[key];
      // check if the key includes the search term by chance
      if (key.toLowerCase().includes(search)) {
        if (!filteredSidebar[key])
          filteredSidebar[key] = { header: el.header, elements: [] };
      }

      for (const id of el.elements) {
        if (id.title.toLowerCase().includes(search) || id.id.includes(search)) {
          if (!filteredSidebar[key])
            filteredSidebar[key] = { header: el.header, elements: [] };

          filteredSidebar[key].elements.push(id);
        }
      }
    }

    sidebar = filteredSidebar;
  }

  // helper method to update the state
  const setHeadingOpen = (heading: string, value: boolean) => {
    if (open[heading] === value) return; // don't update if already value
    setOpen({
      ...open,
      [heading]: value,
    });
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-y-auto overscroll-contain pb-48 md:pb-8 h-0"
      ref={sidebarRef}
    >
      {Object.keys(sidebar).map((id, index) => {
        const { header, elements } = sidebar[id];
        return (
          <SidebarGroupTitle
            searching={!!search}
            key={`${file}-title-${index}`}
            open={open[header.id]}
            setOpen={(open) => setHeadingOpen(header.id, open)}
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
                // keep the header containing this one open on click (while searching)
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
