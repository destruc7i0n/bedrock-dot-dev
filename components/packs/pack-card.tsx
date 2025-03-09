import { FunctionComponent, useState } from "react";

import { useTranslations } from "next-intl";

import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";

import type { PackVersions } from "pages/packs";
import { Tags } from "lib/tags";
import { getPackUrl } from "lib/util";

const TAG_STYLES = {
  [Tags.Beta]: {
    border: "border-2 border-yellow-500 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-600/10",
    translationKey: "component.version_chooser.beta_string",
  },
  [Tags.Stable]: {
    border: "border-2 border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-600/10",
    translationKey: "component.version_chooser.stable_string",
  },
} as const;

type PackCardProps = {
  versionName: string;
  versionData: PackVersions[string];
};

const PackCard: FunctionComponent<PackCardProps> = ({
  versionName,
  versionData,
}) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const isGitHubLink = !!versionData.git;

  const s3Links = (
    <>
      {versionData.b ? (
        <a href={getPackUrl("behaviours", versionName)} className="link" download>
          {t("component.packs_page.behaviours_link")}
        </a>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          {t("component.packs_page.behaviours_link")}
        </p>
      )}

      {versionData.r ? (
        <a
          href={getPackUrl("resources", versionName)}
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
    <button
      className="link cursor-pointer border-none bg-transparent p-0"
      onClick={() => setOpen(!open)}
      aria-label="Show download options"
    >
      <ArrowDownTrayIcon className="pointer-events-none w-6 h-6" />
    </button>
  );

  let title = versionName;
  let border = "border-gray-200 dark:border-transparent";
  if (versionData.t && TAG_STYLES[versionData.t]) {
    const tagStyle = TAG_STYLES[versionData.t];
    border = tagStyle.border;
    title = `${title} (${t(tagStyle.translationKey)})`;
  }

  return (
    <div
      className={`text-center bg-gray-50 dark:bg-dark-gray-950 border ${border} p-2 rounded-md`}
    >
      <p className="text-lg dark:text-gray-200">{title}</p>

      <div className="flex flex-col w-full md:flex-row md:justify-around items-center justify-center">
        {content}
      </div>
    </div>
  );
};

export default PackCard;
