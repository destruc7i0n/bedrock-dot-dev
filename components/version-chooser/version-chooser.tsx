import React, { FunctionComponent, useEffect, useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("component.version_chooser");
  const [quickSelect, setQuickSelect] = useState(true);

  const router = useRouter();
  const { query, locale } = router;

  // set from query string if possible
  useEffect(() => {
    let parsedUrlQuery: ParsedUrlResponse = { major: "", minor: "" };

    if (query?.r && typeof query.r === "string") {
      parsedUrlQuery = parseUrlQuery(query.r, versions);

      setQuickSelect(false);
      if (parsedUrlQuery.major) setMajor(parsedUrlQuery.major);
      if (parsedUrlQuery.minor) setMinor(parsedUrlQuery.minor);
    }
  }, [query]);

  const [stableMajor, stableMinor] = tags[Tags.Stable];

  // initialize to the current stable version
  const [major, setMajor] = useState(stableMajor);
  const [minor, setMinor] = useState(stableMinor);

  // handle locale change and reset to the latest stable version
  useEffect(() => {
    if (!versions[major]) {
      setMajor(stableMajor);
      setMinor(stableMinor);
      setQuickSelect(false);
    }
  }, [locale]);

  let files: string[] = [];
  if (versions[major] && versions[major][minor]) {
    files = versions[major][minor];
  }

  let majorVersions = Object.keys(versions).sort(compareBedrockVersions);
  let minorVersions = Object.keys(versions?.[major] ?? {}).sort(
    compareBedrockVersions,
  );

  // if the major version changes, set the minor to the latest minor from that major version
  useEffect(() => {
    if (!minorVersions.includes(minor)) setMinor(minorVersions[0]);
  }, [major]);

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
          <span className="ml-2 text-sm select-none">{t("view_all")}</span>
        </label>
      </div>

      <div className="w-full mt-2">
        <label className="block text-sm font-bold mb-2">
          {t("file_selection")}
        </label>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 dark:bg-dark-gray-900 border border-gray-200 dark:border-dark-gray-800 p-2 rounded-lg">
          {files.map((file) => (
            <VersionFile
              key={`file-${file}-${minor}`}
              title={file}
              link={getLink(major, minor, file, tags, quickSelect)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default VersionChooser;
