import { useEffect, useMemo, useState } from "react";
import type { FunctionComponent } from "react";

import { useTranslation } from "react-i18next";

import type { TagsResponse } from "@lib/types";
import { Tag } from "@lib/types";
import type { ParsedUrlResponse } from "@lib/util";
import { getLink, parseUrlQuery } from "@lib/util";
import { compareBedrockVersions } from "@lib/versions/helpers";
import type { CompressedVersions } from "@lib/versions/transform";
import { decompressVersions } from "@lib/versions/transform";

import SpecificVersionChooser from "./specific-version-chooser";
import TagVersionChooser from "./tag-version-chooser";

type VersionFileProps = {
  title: string;
  link: string;
};

const VersionFile: FunctionComponent<VersionFileProps> = ({ title, link }) => {
  return (
    <a href={link} className="link truncate px-2 text-lg">
      {title}
    </a>
  );
};

type VersionChooserProps = {
  compressedVersions: CompressedVersions;
  tags: TagsResponse;
};

const VersionChooser: FunctionComponent<VersionChooserProps> = ({
  compressedVersions,
  tags,
}) => {
  const { t } = useTranslation();
  const [quickSelect, setQuickSelect] = useState(true);

  // decompress once
  const versions = useMemo(
    () => decompressVersions(compressedVersions),
    [compressedVersions],
  );

  // Parse query params from browser
  const query = useMemo(() => {
    if (import.meta.env.SSR) return {};
    const params = new URLSearchParams(window.location.search);
    return {
      r: params.get("r") || undefined,
    };
  }, []);

  const [stableMajor, stableMinor] = tags[Tag.Stable];

  // initialize to the current stable version
  const [major, setMajor] = useState(stableMajor);
  const [minor, setMinor] = useState(stableMinor);

  // set from query string if possible
  useEffect(() => {
    if (query?.r && typeof query.r === "string") {
      const parsedUrlQuery: ParsedUrlResponse = parseUrlQuery(
        query.r,
        versions,
      );

      setQuickSelect(false);
      if (parsedUrlQuery.major) setMajor(parsedUrlQuery.major);
      if (parsedUrlQuery.minor) setMinor(parsedUrlQuery.minor);
    }
  }, [query, versions]);

  useEffect(() => {
    if (!versions[major]) {
      setMajor(stableMajor);
      setMinor(stableMinor);
      setQuickSelect(false);
    }
  }, [major, stableMajor, stableMinor, versions]);

  const files = useMemo(() => {
    return versions[major]?.[minor] ?? [];
  }, [versions, major, minor]);

  const majorVersions = useMemo(() => {
    return Object.keys(versions).sort(compareBedrockVersions);
  }, [versions]);

  const minorVersions = useMemo(() => {
    return Object.keys(versions?.[major] ?? {}).sort(compareBedrockVersions);
  }, [versions, major]);

  // if the major version changes, set the minor to the latest minor from that major version
  useEffect(() => {
    if (!minorVersions.includes(minor)) {
      setMinor(minorVersions[0]);
    }
  }, [major, minor, minorVersions]);

  const VersionChooserComponent = quickSelect
    ? TagVersionChooser
    : SpecificVersionChooser;

  return (
    <>
      <div className="flex w-full flex-row">
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
            className="rounded-md border-gray-300 text-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            checked={!quickSelect}
            onChange={({ target: { checked } }) => setQuickSelect(!checked)}
          />
          <span className="ml-2 select-none text-sm">
            {t("component.version_chooser.view_all")}
          </span>
        </label>
      </div>

      <div className="mt-2 w-full">
        <label className="mb-2 block text-sm font-bold">
          {t("component.version_chooser.file_selection")}
        </label>
        <div className="grid w-full grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-dark-gray-800 dark:bg-dark-gray-900 md:grid-cols-3">
          {files.map((file) => {
            const fileKey = file.toLowerCase().split(" ").join("_");
            const fileName = t(`files.${fileKey}`, { defaultValue: file });
            return (
              <VersionFile
                key={`file-${file}-${minor}`}
                title={fileName}
                link={getLink(major, minor, file, tags, quickSelect)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default VersionChooser;
