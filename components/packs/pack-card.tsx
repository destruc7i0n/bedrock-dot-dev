import React, { FunctionComponent, useState } from "react";

import { useTranslation } from "next-i18next";

import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";

import type { PackVersions } from "pages/packs";

type PackCardProps = {
  versionName: string;
  versionData: PackVersions[string];
};

const getUrl = (folder: string, id: string) => {
  return ["https://void.bedrock.dev", folder, `${id}.zip`].join("/");
};

const PackCard: FunctionComponent<PackCardProps> = ({
  versionName,
  versionData,
}) => {
  const { t } = useTranslation("common");

  const [open, setOpen] = useState(false);

  const isGitHubLink = !!versionData.git;

  const s3Links = (
    <>
      {versionData.b ? (
        <a href={getUrl("behaviours", versionName)} className="link" download>
          {t("component.packs_page.behaviours_link")}
        </a>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          {t("component.packs_page.behaviours_link")}
        </p>
      )}

      {versionData.r ? (
        <a
          href={getUrl("resources", versionName)}
          className="link"
          target="_blank"
          download
          rel="noopener"
        >
          {t("component.packs_page.resources_link")}
        </a>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          {t("component.packs_page.resources_link")}
        </p>
      )}
    </>
  );

  const githubLink = (
    <a href={versionData.git} className="link" target="_blank" rel="noopener">
      GitHub
    </a>
  );

  const content = isGitHubLink ? (
    githubLink
  ) : open ? (
    s3Links
  ) : (
    <span className="link cursor-pointer" onClick={() => setOpen(!open)}>
      <ArrowDownTrayIcon className="pointer-events-none w-6 h-6" />
    </span>
  );

  return (
    <div className="text-center bg-gray-50 dark:bg-dark-gray-950 border border-gray-200 dark:border-transparent p-2 rounded-md">
      <p className="text-lg dark:text-gray-200">{versionName}</p>
      <div className="flex flex-col w-full md:flex-row md:justify-around items-center justify-center">
        {content}
      </div>
    </div>
  );
};

export default PackCard;
