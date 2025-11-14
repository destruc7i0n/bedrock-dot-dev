import { useEffect, useState } from "react";
import type { FunctionComponent } from "react";

import { useTranslation } from "react-i18next";

import { cn } from "@lib/cn";
import { TAG_STYLES } from "@lib/constants/tag-styles";
import { Tag } from "@lib/types";

import type { VersionSelectorProps } from "./specific-version-chooser";

const TagVersionChooser: FunctionComponent<VersionSelectorProps> = ({
  tags,
  setMajor,
  setMinor,
}) => {
  const { t } = useTranslation();
  const [version, setVersion] = useState(Tag.Stable);

  const updateVersion = () => {
    const [major, minor] = tags[version];
    setMajor(major);
    setMinor(minor);
  };

  useEffect(updateVersion, [version, tags, setMajor, setMinor]);

  const selectClassName = cn(
    "w-full rounded-md leading-5 text-black focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50",
    TAG_STYLES[version]
      ? [TAG_STYLES[version].border, "font-medium", "dark:text-gray-200"]
      : "border-gray-300 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-200",
  );

  return (
    <div className="mb-2 w-full">
      <label className="mb-2 block text-sm font-bold" htmlFor="tag">
        {t("component.version_chooser.tagged_version_title")}
      </label>
      <select
        id="tag"
        className={selectClassName}
        value={version}
        onChange={({ target: { value } }) => setVersion(value as Tag)}
      >
        <option value={Tag.Stable}>
          {tags.stable[1]} ({t("component.version_chooser.stable_string")})
        </option>
        <option value={Tag.Beta}>
          {tags.beta[1]} ({t("component.version_chooser.beta_string")})
        </option>
      </select>
    </div>
  );
};

export default TagVersionChooser;
