"use client";

import { FunctionComponent, useState } from "react";

import cn from "classnames";

import { Locale } from "../lib/i18n";

type Props = {
  className?: string;
  locale?: Locale;
};

const LanguageSelect: FunctionComponent<Props> = ({
  className,
  locale = Locale.English,
}) => {
  const [localeValue, setLocaleValue] = useState(locale);

  // In App Router, this is display-only for now (English only supported)
  // For Pages Router with i18n, the locale prop would be from router.locale

  return (
    <div className={cn("relative dark:text-gray-200", className)}>
      <label className="block text-sm font-bold mb-1 sr-only" htmlFor="locale">
        Language Select
      </label>
      <select
        value={localeValue}
        onChange={({ target: { value } }) => setLocaleValue(value as Locale)}
        id="locale"
        className="leading-4 border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-dark-gray-900 dark:border-dark-gray-800 text-sm py-2 pl-2 block"
      >
        <option value={Locale.English}>EN</option>
        <option value={Locale.Chinese}>中文</option>
      </select>
    </div>
  );
};

export default LanguageSelect;
