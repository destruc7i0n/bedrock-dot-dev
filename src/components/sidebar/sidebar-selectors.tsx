import { ChangeEvent, FunctionComponent, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { navigate } from "astro:transitions/client";

import {
  compareBedrockVersions,
  getLink,
  getMinorVersionTitle,
} from "@lib/util";

interface Props {
  major: string;
  minor: string;
  file: string;
  versions: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  tags: {
    stable: string[];
    beta: string[];
  };
}

const SidebarSelectors: FunctionComponent<Props> = ({
  major,
  minor,
  file,
  versions,
  tags,
}) => {
  const { t: translate } = useTranslation();

  const translateFileName = (fileName: string) => {
    const key = fileName.toLowerCase().split(" ").join("_");
    return translate(`files.${key}`, { defaultValue: fileName });
  };

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
          className="block w-full rounded-md border-gray-300 leading-4 text-black focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-200"
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
