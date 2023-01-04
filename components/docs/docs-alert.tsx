import React, { FunctionComponent } from "react";

import cn from "classnames";

import type { DocAlert as DocAlertType } from "lib/docs-alerts";

const DocsAlert: FunctionComponent<DocAlertType> = ({
  title,
  type,
  message,
}) => {
  return (
    <div
      className={cn("docs-alert p-4 mb-4 lg:text-lg rounded-lg border-2", {
        "text-blue-700 border-blue-300 bg-blue-100 dark:bg-blue-200 dark:border-transparent dark:text-blue-800":
          type === "info",
        "text-green-700 border-green-300 bg-green-100 dark:bg-green-200 dark:border-transparent dark:text-green-800":
          type === "success",
        "text-yellow-700 border-yellow-300 bg-yellow-100 dark:bg-yellow-200 dark:border-transparent dark:text-yellow-800":
          type === "warning",
        "text-red-700 border-red-300 bg-red-100 dark:bg-red-200 dark:border-transparent dark:text-red-800":
          type === "error",
      })}
    >
      <span className="font-medium">{title}:</span>{" "}
      <span dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default DocsAlert;
