import { FunctionComponent, useEffect, useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { useTranslation } from "next-i18next";

import SpecificVersionChooser from "./specific-version-chooser";
import TagVersionChooser from "./tag-version-chooser";

import {
  compareBedrockVersions,
  getLink,
  ParsedUrlResponse,
  parseUrlQuery,
} from "lib/util";
import { BedrockVersions } from "lib/versions";
import { Tags, TagsResponse } from "lib/tags";
import { translateFileNames } from "lib/i18n";

type VersionFileProps = {
  title: string;
  link: string;
};

const VersionFile: FunctionComponent<VersionFileProps> = ({ title, link }) => {
  return (
    <Link
      href={`/docs/[...slug]`}
      as={link}
      className="link px-2 truncate text-lg"
    >
      {title}
    </Link>
  );
};

type VersionChooserProps = {
  versions: BedrockVersions;
  tags: TagsResponse;
};

const VersionChooser: FunctionComponent<VersionChooserProps> = ({
  versions,
  tags,
}) => {
  const { t } = useTranslation("common");
  const [quickSelect, setQuickSelect] = useState(true);

  const router = useRouter();
  const { query, locale } = router;

  const [stableMajor, stableMinor] = tags[Tags.Stable];

  // initialize to the current stable version
  const [major, setMajor] = useState(stableMajor);
  const [minor, setMinor] = useState(stableMinor);

  // set from query string if possible
  useEffect(() => {
    let parsedUrlQuery: ParsedUrlResponse = { major: "", minor: "" };

    if (query?.r && typeof query.r === "string") {
      parsedUrlQuery = parseUrlQuery(query.r, versions);

      // Intentionally setting state in effect to sync with URL query params
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuickSelect(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsedUrlQuery.major) setMajor(parsedUrlQuery.major);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsedUrlQuery.minor) setMinor(parsedUrlQuery.minor);
    }
  }, [query, versions]);

  // handle locale change and reset to the latest stable version
  useEffect(() => {
    if (!versions[major]) {
      // Intentionally setting state in effect to sync with locale changes
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMajor(stableMajor);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMinor(stableMinor);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuickSelect(false);
    }
  }, [locale, major, stableMajor, stableMinor, versions]);

  const fileNameTranslations: { [k: string]: string } = t("files", {
    returnObjects: true,
  });
  let files: string[] = [];
  if (versions[major] && versions[major][minor]) {
    files = versions[major][minor];
  }

  const majorVersions = Object.keys(versions).sort(compareBedrockVersions);
  const minorVersions = Object.keys(versions?.[major] ?? {}).sort(
    compareBedrockVersions
  );

  // if the major version changes, set the minor to the latest minor from that major version
  useEffect(() => {
    if (!minorVersions.includes(minor)) {
      // Intentionally setting state in effect to ensure valid minor version
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMinor(minorVersions[0]);
    }
  }, [major, minor, minorVersions]);

  const VersionChooserComponent = quickSelect
    ? TagVersionChooser
    : SpecificVersionChooser;

  return (
    <>
      <div className="w-full flex flex-row">
        <VersionChooserComponent
          major={major}
          minor={minor}
          majorVersions={majorVersions}
          minorVersions={minorVersions}
          setMajor={setMajor}
          setMinor={setMinor}
          tags={tags}
        />
      </div>
      <div className="w-full">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="text-blue-500 border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            checked={!quickSelect}
            onChange={({ target: { checked } }) => setQuickSelect(!checked)}
          />
          <span className="ml-2 text-sm select-none">
            {t("component.version_chooser.view_all")}
          </span>
        </label>
      </div>

      <div className="w-full mt-2">
        <label className="block text-sm font-bold mb-2">
          {t("component.version_chooser.file_selection")}
        </label>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 dark:bg-dark-gray-900 border border-gray-200 dark:border-dark-gray-800 p-2 rounded-lg">
          {files.map((file) => (
            <VersionFile
              key={`file-${file}-${minor}`}
              title={translateFileNames(fileNameTranslations, file)}
              link={getLink(major, minor, file, tags, quickSelect)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default VersionChooser;
