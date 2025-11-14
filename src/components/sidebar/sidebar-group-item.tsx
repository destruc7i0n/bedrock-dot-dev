import { memo } from "react";
import type { FunctionComponent } from "react";

import { cn } from "@lib/cn";

import { removeHashIfNeeded } from "@lib/util";

type Props = {
  title: string;
  id: string;
  hash: string;
  onClick: () => void;
};

const SidebarGroupItem: FunctionComponent<Props> = ({
  title,
  id,
  hash,
  onClick,
}) => {
  const active = removeHashIfNeeded(hash) === id;

  return (
    <li className="my-1">
      <a
        className={cn(
          "sidebar-id block w-full rounded-md px-2 py-1 text-sm",
          {
            "bg-gray-100 text-blue-600 dark:bg-dark-gray-900 dark:text-blue-500":
              active,
            "text-gray-800 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-dark-gray-900 dark:hover:text-gray-200":
              !active,
          },
          "transition-all duration-150 ease-in-out",
        )}
        href={`#${encodeURIComponent(id)}`}
        onClick={onClick}
        data-astro-reload
      >
        {title}
      </a>
    </li>
  );
};

export default memo(SidebarGroupItem);
