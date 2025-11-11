import { memo } from "react";
import type { FunctionComponent } from "react";
import { useStore } from "@nanostores/react";
import { sidebarFilter } from "@stores/sidebar-filter";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

const SidebarFilter: FunctionComponent = () => {
  const { t } = useTranslation();
  const $filter = useStore(sidebarFilter);

  return (
    <div className="mt-4">
      <label className="sr-only mb-1 block text-sm font-bold" htmlFor="filter">
        {t("component.sidebar.filter_title")}
      </label>
      <div className="relative w-full rounded-lg">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <span className="leading-4 text-gray-500">
            <MagnifyingGlassIcon className="pointer-events-none h-4 w-4" />
          </span>
        </div>
        <input
          id="filter"
          className="block w-full rounded-md border-gray-300 bg-white px-4 pl-8 leading-4 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-200 dark:placeholder-gray-400 xl:pl-7"
          type="text"
          placeholder={t("component.sidebar.filter_title")}
          value={$filter}
          onChange={({ target: { value } }) => sidebarFilter.set(value)}
        />
      </div>
    </div>
  );
};

export default memo(SidebarFilter);
