import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { VersionSelectorProps } from "./specific-version-chooser";
import { Tags } from "../../lib/tags";

const TagVersionChooser: FunctionComponent<VersionSelectorProps> = ({
  tags,
  setMajor,
  setMinor,
}) => {
  const { t } = useTranslation();
  const [version, setVersion] = useState(Tags.Stable);

  const updateVersion = () => {
    const [major, minor] = tags[version];
    setMajor(major);
    setMinor(minor);
  };

  useEffect(updateVersion, [version, tags, setMajor, setMinor]);

  return (
    <div className="mb-2 w-full">
      <label className="mb-2 block text-sm font-bold" htmlFor="tag">
        {t("component.version_chooser.tagged_version_title")}
      </label>
      <select
        id="tag"
        className="w-full rounded-md border-gray-300 leading-5 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-dark-gray-800 dark:bg-dark-gray-900 dark:text-gray-200"
        value={version}
        onChange={({ target: { value } }) => setVersion(value as Tags)}
      >
        <option value={Tags.Stable}>
          {tags.stable[1]} ({t("component.version_chooser.stable_string")})
        </option>
        <option value={Tags.Beta}>
          {tags.beta[1]} ({t("component.version_chooser.beta_string")})
        </option>
      </select>
    </div>
  );
};

export default TagVersionChooser;
