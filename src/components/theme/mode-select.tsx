import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/20/solid";

import cn from "classnames";

import { useTheme, Theme } from "./use-theme";

const themes = {
  [Theme.System]: {
    icon: ComputerDesktopIcon,
  },
  [Theme.Light]: {
    icon: SunIcon,
  },
  [Theme.Dark]: {
    icon: MoonIcon,
  },
};

type Props = {
  className?: string;
};

const ModeSelect: FunctionComponent<Props> = ({ className }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const Icon = themes[theme].icon;

  return (
    <div className={cn("relative dark:text-gray-200", className)}>
      <label className="sr-only mb-1 block text-sm font-bold" htmlFor="mode">
        Mode Select
      </label>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="leading-4">
          <Icon className="pointer-events-none h-4 w-4" />
        </span>
      </div>
      <select
        value={theme}
        onChange={({ target: { value } }) => setTheme(value as Theme)}
        id="mode"
        className="block rounded-md border-gray-300 py-2 pl-8 text-sm leading-4 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-dark-gray-800 dark:bg-dark-gray-900"
      >
        <option value={Theme.System}>
          {t("component.color_theme_select.system")}
        </option>
        <option value={Theme.Dark}>
          {t("component.color_theme_select.dark")}
        </option>
        <option value={Theme.Light}>
          {t("component.color_theme_select.light")}
        </option>
      </select>
    </div>
  );
};

export default ModeSelect;
