import { FunctionComponent, useEffect, useState } from "react";
import cn from "classnames";
import { useStore } from "@nanostores/react";

import Selectors from "./sidebar-selectors";
import { sidebarOpen } from "@stores/sidebar";
import SidebarMask from "./sidebar-mask";
import SidebarContent from "./sidebar-content";
import SidebarFilter from "./sidebar-filter";
import ModeSelect from "@components/theme/mode-select";
import { useIsMobile } from "@hooks/media-query";

import type { SidebarStructure } from "./index";
import type { BedrockVersions } from "@lib/versions";
import type { TagsResponse } from "@lib/tags";

interface Props {
  sidebar: SidebarStructure;
  file: string;
  major: string;
  minor: string;
  versions: BedrockVersions;
  tags: TagsResponse;
}

const Sidebar: FunctionComponent<Props> = ({
  sidebar,
  file,
  major,
  minor,
  versions,
  tags,
}) => {
  const [filter, setFilter] = useState("");
  const [mounted, setMounted] = useState(false);

  const mobile = useIsMobile();
  const $open = useStore(sidebarOpen);

  // Reset filter when the page changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilter("");
    setMounted(true);
  }, [file]);

  // Handle body overflow for mobile
  useEffect(() => {
    if (mobile) document.body.style.overflow = $open ? "hidden" : "initial";
  }, [$open, mobile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "initial";
    };
  }, []);

  if (!sidebar) return null;

  return (
    <>
      {$open && mobile && mounted && <SidebarMask />}
      <aside className={cn("sidebar", { open: $open, mounted })}>
        <div className="w-full p-4 border-b border-gray-200 dark:border-dark-gray-800">
          {!Object.keys(sidebar).length ? (
            <div className="animate-pulse w-full">
              <div className="flex flex-row">
                <div className="w-2/4 bg-gray-100 dark:bg-dark-gray-800 h-8" />
                <div className="w-2/4 bg-gray-100 dark:bg-dark-gray-800 h-8 ml-2" />
              </div>
              <div className="w-4/5 bg-gray-100 dark:bg-dark-gray-800 h-8 mt-4" />
            </div>
          ) : (
            <>
              <Selectors
                major={major}
                minor={minor}
                file={file}
                versions={versions}
                tags={tags}
              />
              <SidebarFilter setValue={setFilter} value={filter} />
            </>
          )}
        </div>
        <SidebarContent search={filter} sidebar={sidebar} file={file} />
        <div className="flex flex-row justify-end items-center bg-white dark:bg-dark-gray-950 w-full px-4 py-2 border-t border-gray-200 dark:border-dark-gray-800 bottom-safe-area-inset inset-2">
          <ModeSelect className="ml-2" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
