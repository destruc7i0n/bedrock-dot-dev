import { memo, useMemo } from "react";
import type { ChangeEvent, FunctionComponent } from "react";

import { useTranslation } from "react-i18next";
import { navigate } from "astro:transitions/client";
import { cn } from "@lib/cn";

import {
  compareBedrockVersions,
  getLink,
  getMinorVersionTitle,
} from "@lib/util";
import { getVersionTag } from "@lib/tags";
import { TAG_STYLES } from "@lib/tag-styles";
import {
  decompressVersions,
  type CompressedVersions,
} from "@lib/transform-versions";

interface Props {
  major: string;
  minor: string;
  file: string;
  compressedVersions: CompressedVersions;
  tags: {
    stable: string[];
    beta: string[];
  };
}

const SidebarSelectors: FunctionComponent<Props> = ({
  major,
  minor,
  file,
  compressedVersions,
  tags,
}) => {
  const { t: translate } = useTranslation();

  // decompress once
  const versions = useMemo(
    () => decompressVersions(compressedVersions),
    [compressedVersions],
  );

  const translateFileName = (fileName: string) => {
    const key = fileName.toLowerCase().split(" ").join("_");
    return translate(`files.${key}`, { defaultValue: fileName });
  };

  const currentTag = getVersionTag([major, minor], tags);

  const versionSelectClassName = cn(
    "block w-full rounded-md leading-4 text-black focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50",
    currentTag && TAG_STYLES[currentTag]
      ? [TAG_STYLES[currentTag].border, "font-medium", "dark:text-gray-200"]
      : "border-gray-300 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-200",
  );

  const options = useMemo(() => {
    if (!major || !versions) return [];

    const result = [];
    const majorVersions: string[] = [];

    // Sort major versions
    const sortedMajors = Object.keys(versions).sort(compareBedrockVersions);

    // generate the dropdown
    for (const majorVersion of sortedMajors) {
      // Sort minor versions for this major
      const sortedMinors = Object.keys(versions[majorVersion]).sort(
        compareBedrockVersions,
      );

      for (const minorVersion of sortedMinors) {
        // only add the major version once
        if (!majorVersions.includes(majorVersion)) {
          result.push(
            <option key={`version-${majorVersion}`} disabled>
              {majorVersion}
            </option>,
          );
          majorVersions.push(majorVersion);
        }
        const path = `${majorVersion}/${minorVersion}`;

        const title = getMinorVersionTitle(
          [majorVersion, minorVersion],
          tags,
          translate,
        );
        result.push(
          <option key={`version-${majorVersion}-${minorVersion}`} value={path}>
            {title}
          </option>,
        );
      }
    }
    return result;
  }, [major, versions, tags, translate]);

  if (!major || !versions) return null;

  const files = versions[major] && versions[major][minor];

  const onVersionChange = ({
    target: { value },
  }: ChangeEvent<HTMLSelectElement>) => {
    const parts = value.split("/");
    const [major, minor] = parts;
    const files = versions[major][minor];

    let newFile = file;
    // if the file isn't available go to the first one
    if (!files.includes(file)) {
      // check without case
      const caseCheck = files.find(
        (f) => f.toLowerCase() === file.toLowerCase(),
      );
      if (caseCheck) {
        newFile = caseCheck;
      } else {
        newFile = files[0];
      }
    }

    const link = getLink(major, minor, newFile, tags, true);
    navigate(link);
  };

  const onFileChange = ({
    target: { value },
  }: ChangeEvent<HTMLSelectElement>) => {
    const link = getLink(major, minor, value, tags, true);
    navigate(link);
  };

  return (
    <div className="flex flex-row">
      <div className="w-1/2">
        <label
          className="sr-only mb-1 block text-sm font-bold"
          htmlFor="version"
        >
          {translate("component.sidebar.version_title")}
        </label>
        <select
          value={`${major}/${minor}`}
          id="version"
          onChange={onVersionChange}
          className={versionSelectClassName}
        >
          {options}
        </select>
      </div>
      <div className="ml-4 w-1/2">
        <label className="sr-only mb-1 block text-sm font-bold" htmlFor="file">
          {translate("component.sidebar.file_title")}
        </label>
        {files && (
          <select
            value={file}
            id="file"
            onChange={onFileChange}
            className="block w-full rounded-md border-gray-300 leading-4 text-black focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-200"
          >
            {files.map((file) => (
              <option key={`file-${file}`} value={file}>
                {translateFileName(file)}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default memo(SidebarSelectors);
