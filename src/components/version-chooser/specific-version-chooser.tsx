import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@lib/cn";

import { getMinorVersionTitle } from "../../lib/util";
import type { TagsResponse } from "../../lib/tags";
import { getVersionTag } from "../../lib/tags";
import { TAG_STYLES } from "../../lib/tag-styles";

export type VersionSelectorProps = {
  majorVersions: string[];
  minorVersions: string[];

  major: string;
  minor: string;
  setMajor: (v: string) => void;
  setMinor: (v: string) => void;

  tags: TagsResponse;
};

const SpecificVersionChooser: FunctionComponent<VersionSelectorProps> = ({
  majorVersions,
  minorVersions,
  major,
  minor,
  setMinor,
  setMajor,
  tags,
}) => {
  const { t } = useTranslation();

  const currentTag = getVersionTag([major, minor], tags);

  const majorSelectClassName = cn(
    "w-full rounded-md leading-5 text-black focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50",
    currentTag && TAG_STYLES[currentTag]
      ? [TAG_STYLES[currentTag].border, "font-medium", "dark:text-gray-200"]
      : "border-gray-300 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-200",
  );

  const minorSelectClassName = cn(
    "w-full rounded-md leading-5 text-black focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50",
    currentTag && TAG_STYLES[currentTag]
      ? [TAG_STYLES[currentTag].border, "font-medium", "dark:text-gray-200"]
      : "border-gray-300 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-200",
  );

  return (
    <>
      <div className="mb-2 w-1/2 pr-2">
        <label className="mb-2 block text-sm font-bold" htmlFor="major">
          {t("component.version_chooser.major")}
        </label>
        <select
          id="major"
          className={majorSelectClassName}
          value={major}
          onChange={({ target: { value } }) => setMajor(value)}
        >
          {majorVersions.map((version) => (
            <option key={`major-${version}`} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2 w-1/2">
        <label className="mb-2 block text-sm font-bold" htmlFor="minor">
          {t("component.version_chooser.minor")}
        </label>
        <select
          id="minor"
          className={minorSelectClassName}
          value={minor}
          onChange={({ target: { value } }) => setMinor(value)}
        >
          {minorVersions.map((version) => {
            const title = getMinorVersionTitle([major, version], tags, t);
            return (
              <option key={`minor-${version}`} value={version}>
                {title}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};

export default SpecificVersionChooser;
