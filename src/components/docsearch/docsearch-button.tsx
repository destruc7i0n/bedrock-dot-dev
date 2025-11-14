import { forwardRef, memo } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { cn } from "@lib/cn";

type Props = {
  placeHolder: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
};

const baseButtonClasses =
  "block cursor-pointer rounded-md border border-gray-300 bg-white text-left leading-4 text-gray-400 transition-colors hover:border-gray-400 hover:bg-gray-50 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-400 dark:hover:border-dark-gray-700 dark:hover:bg-dark-gray-800";

const DocSearchButton = forwardRef<HTMLButtonElement, Props>(
  ({ placeHolder, size = "md", onClick }, ref) => {
    if (size === "sm") {
      // icon only button
      return (
        <button
          ref={ref}
          type="button"
          className={cn(baseButtonClasses, "flex rounded-lg p-1.5")}
          onClick={onClick}
        >
          <div className="pointer-events-none flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 dark:text-white" />
          </div>
        </button>
      );
    }

    return (
      <div className="relative w-full rounded-lg">
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5",
            size === "lg" && "lg:pl-3",
          )}
        >
          <MagnifyingGlassIcon
            className={cn(
              "h-4 w-4 text-gray-600 dark:text-white",
              size === "lg" && "lg:h-5 lg:w-5",
            )}
          />
        </div>
        <button
          ref={ref}
          type="button"
          className={cn(
            baseButtonClasses,
            "w-full pl-8",
            size === "lg" ? "py-3 lg:py-4 lg:pl-10" : "py-2",
          )}
          onClick={onClick}
        >
          {placeHolder}
        </button>
      </div>
    );
  },
);

export default memo(DocSearchButton);
