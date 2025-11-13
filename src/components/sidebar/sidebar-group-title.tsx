import React, { Children } from "react";
import type { MouseEvent } from "react";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";

import cn from "classnames";

import { removeHashIfNeeded } from "../../lib/util";

type Props = {
  title: string;
  id: string;
  hash: string;
  open: boolean;
  onToggle: (open: boolean) => void;
  children?: React.ReactNode;
};

const SidebarGroupTitle: React.FunctionComponent<Props> = ({
  title,
  id,
  children,
  hash,
  open,
  onToggle,
}) => {
  const hasChildren = !!Children.count(children);

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    onToggle(e.currentTarget.open);
  };

  const handleSummaryClick = (e: MouseEvent) => {
    // do not toggle open if this was a click on the link
    if ((e.nativeEvent.target as HTMLElement).nodeName === "A") {
      e.stopPropagation();
    }
  };

  const active = removeHashIfNeeded(hash) === id;

  return (
    <details className="sidebar-group" open={open} onToggle={handleToggle}>
      <summary
        className={cn(
          "flex cursor-pointer flex-row bg-white px-4 py-2 text-gray-800 dark:bg-dark-gray-950 dark:text-gray-300",
          { "sticky top-0": open && hasChildren, "select-none": hasChildren },
          "border-b border-gray-200 dark:border-dark-gray-800",
        )}
        onClick={handleSummaryClick}
      >
        <a
          className={cn(
            "font-bold",
            {
              "text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400":
                active,
              "hover:text-gray-900 dark:hover:text-gray-200": !active,
            },
            "transition-all duration-75 ease-in-out",
          )}
          href={`#${encodeURIComponent(id)}`}
          data-astro-reload
        >
          {title}
        </a>
        {hasChildren && (
          <div
            className={cn(
              "ml-auto flex transform cursor-pointer select-none items-center transition duration-150 ease-in-out",
              open ? "-rotate-90" : "",
            )}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </div>
        )}
      </summary>
      {hasChildren && (
        <ul className="nav border-b border-gray-200 pl-4 pr-1 dark:border-dark-gray-800">
          {children}
        </ul>
      )}
    </details>
  );
};

export default SidebarGroupTitle;
