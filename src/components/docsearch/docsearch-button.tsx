import { forwardRef, memo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import cn from "classnames";

type Props = {
  placeHolder: string;
  xl?: boolean;
  onClick?: () => void;
};

const DocSearchButton = forwardRef<HTMLButtonElement, Props>(
  ({ placeHolder, xl = false, onClick }, ref) => {
    return (
      <div className="relative w-full rounded-lg">
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center",
            xl ? "pl-2 lg:pl-4" : "pl-2",
          )}
        >
          <span className="leading-4 text-white">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
        </div>
        <button
          ref={ref}
          type="button"
          className={cn(
            "block w-full cursor-pointer rounded-md border border-gray-300 bg-white px-4 pl-8 text-left leading-4 text-gray-400 transition-colors hover:border-gray-400 hover:bg-gray-50 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-400 dark:hover:border-dark-gray-700 dark:hover:bg-dark-gray-800",
            xl ? "py-2 lg:py-4 lg:pl-10" : "py-2 lg:pl-8",
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
