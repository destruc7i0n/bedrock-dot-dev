import {
  ChangeEvent,
  FunctionComponent,
  memo,
  useContext,
  useMemo,
} from "react";

import { useTranslations } from "next-intl";

import { useRouter } from "next/router";

import VersionContext from "../version-context";
import { bedrockVersionsInOrder } from "lib/bedrock-versions-transformer";
import { getLink, getMinorVersionTitle } from "lib/util";

const SidebarSelectors: FunctionComponent = () => {
  const t = useTranslations();

  // get from the context
  const { major, minor, file, versions, tags } = useContext(VersionContext);

  const router = useRouter();

  const options = useMemo(() => {
    if (!major || !versions) return [];

    const result = [];
    const majorVersions: string[] = [];

    // generate the dropdown
    for (const [major, minor] of bedrockVersionsInOrder(versions)) {
      // only add the major version once
      if (!majorVersions.includes(major)) {
        result.push(
          <option key={`version-${major}`} disabled>
            {major}
          </option>,
        );
        majorVersions.push(major);
      }
      const path = `${major}/${minor}`;

      const title = getMinorVersionTitle([major, minor], tags, t);
      result.push(
        <option key={`version-${major}-${minor}`} value={path}>
          {title}
        </option>,
      );
    }
    return result;
  }, [major, versions, tags, t]);

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

    router.push("/docs/[...slug]", getLink(major, minor, newFile, tags, true));
  };

  const onFileChange = ({
    target: { value },
  }: ChangeEvent<HTMLSelectElement>) => {
    router.push("/docs/[...slug]", getLink(major, minor, value, tags, true));
  };

  return (
    <div className="flex flex-row">
      <div className="w-1/2">
        <label
          className="block text-sm font-bold mb-1 sr-only"
          htmlFor="version"
        >
          {t("component.sidebar.version_title")}
        </label>
        <select
          value={`${major}/${minor}`}
          id="version"
          onChange={onVersionChange}
          className="block w-full leading-4 border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black dark:text-gray-200 dark:bg-dark-gray-900 dark:border-dark-gray-800"
        >
          {options}
        </select>
      </div>
      <div className="w-1/2 ml-4">
        <label className="block text-sm font-bold mb-1 sr-only" htmlFor="file">
          {t("component.sidebar.file_title")}
        </label>
        {files && (
          <select
            value={file}
            id="file"
            onChange={onFileChange}
            className="block w-full leading-4 border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black dark:text-gray-200 dark:bg-dark-gray-900 dark:border-dark-gray-800"
          >
            {files.map((file) => (
              <option key={`file-${file}`} value={file}>
                {file}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default memo(SidebarSelectors);
