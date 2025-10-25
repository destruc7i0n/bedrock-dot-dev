import { FunctionComponent, useContext, useEffect, useState } from "react";

import cn from "classnames";

import Selectors from "./sidebar-selectors";
import { SidebarContext } from "./sidebar-context";
import SidebarMask from "./sidebar-mask";
import SidebarContent from "./sidebar-content";
import SidebarFilter from "./sidebar-filter";

import ModeSelect from "../mode-select";
import LanguageSelect from "../language-select";

import { useIsMobile } from "hooks/media-query";

export interface SidebarStructureElement {
  title: string;
  id: string;
}

export interface SidebarStructureGroup {
  header: SidebarStructureElement;
  elements: SidebarStructureElement[];
}

export type SidebarStructure = {
  [key: string]: SidebarStructureGroup;
};

type Props = {
  sidebar: SidebarStructure;
  file: string;
  loading: boolean;
};

const Sidebar: FunctionComponent<Props> = ({ sidebar, file, loading }) => {
  const [filter, setFilter] = useState("");
  const [mounted, setMounted] = useState(false);

  const mobile = useIsMobile();

  const { open } = useContext(SidebarContext);

  // reset when the page changes
  useEffect(() => {
    // Intentionally setting state in effect to sync with route changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilter("");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [file]);

  useEffect(() => {
    if (mobile) document.body.style.overflow = open ? "hidden" : "initial";
  }, [open, mobile]);

  // on unmount ensure scrolling
  useEffect(() => {
    return () => {
      document.body.style.overflow = "initial";
    };
  }, []);

  if (!sidebar) return null;

  const loadingContent = (
    <div className="flex-1 flex px-4 py-4">
      <div className="animate-pulse w-full">
        <div className="w-4/5 bg-gray-100 dark:bg-dark-gray-800 h-8" />
        <div className="w-2/3 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4" />
        <div className="w-5/6 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4" />
        <div className="w-1/2 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4" />

        <div className="w-3/5 bg-gray-100 dark:bg-dark-gray-800 h-8 mt-10" />
        <div className="w-2/4 bg-gray-100 dark:bg-dark-gray-800 h-s mt-4" />
        <div className="w-2/3 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4" />
        <div className="w-3/4 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4" />
        <div className="w-2/3 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4" />
        <div className="w-3/5 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4" />
      </div>
    </div>
  );

  const loadingSelectors = (
    <div className="animate-pulse w-full">
      <div className="flex flex-row">
        <div className="w-2/4 bg-gray-100 dark:bg-dark-gray-800 h-8" />
        <div className="w-2/4 bg-gray-100 dark:bg-dark-gray-800 h-8 ml-2" />
      </div>
      <div className="w-4/5 bg-gray-100 dark:bg-dark-gray-800 h-8 mt-4" />
    </div>
  );

  return (
    <>
      {open && mobile && <SidebarMask />}
      <aside className={cn("sidebar", { open, mounted })}>
        <div className="w-full p-4 border-b border-gray-200 dark:border-dark-gray-800">
          {loading || !Object.keys(sidebar).length ? (
            loadingSelectors
          ) : (
            <>
              <Selectors />
              <SidebarFilter setValue={setFilter} value={filter} />
            </>
          )}
        </div>
        {loading ? (
          loadingContent
        ) : (
          <>
            <SidebarContent search={filter} sidebar={sidebar} file={file} />
            <div className="flex flex-row justify-end items-center bg-white dark:bg-dark-gray-950 w-full px-4 py-2 border-t border-gray-200 dark:border-dark-gray-800 bottom-safe-area-inset inset-2">
              <LanguageSelect />
              <ModeSelect className="ml-2" />
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
