"use client";

import { FunctionComponent, useEffect, useSyncExternalStore } from "react";

import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/20/solid";

import { useTranslations } from "next-intl";

import cn from "classnames";

import { useTheme } from "next-themes";

enum Theme {
  System = "system",
  Light = "light",
  Dark = "dark",
}

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

const updateThemeColour = (theme: Theme) => {
  const themeColour = theme === Theme.Light ? "#f9fafb" : "#18191a";
  const el = document.querySelector(`meta[name='theme-color']`);
  if (!!el) el!.setAttribute("content", themeColour);
};

const onResolvedThemeChange = (theme: Theme) => {
  updateThemeColour(theme);
};

const ModeSelect: FunctionComponent<Props> = ({ className }) => {
  const t = useTranslations("component.color_theme_select");

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { theme: hookTheme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    onResolvedThemeChange(resolvedTheme as Theme);
  }, [resolvedTheme]);

  const theme = !mounted ? Theme.System : hookTheme;

  const Icon = themes[theme as Theme].icon;

  return (
    <div className={cn("relative dark:text-gray-200", className)}>
      <label className="block text-sm font-bold mb-1 sr-only" htmlFor="mode">
        Mode Select
      </label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <span className="leading-4">
          <Icon className="pointer-events-none w-4 h-4" />
        </span>
      </div>
      <select
        value={theme}
        onChange={({ target: { value } }) => setTheme(value as Theme)}
        id="mode"
        className="leading-4 border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-dark-gray-900 dark:border-dark-gray-800 text-sm py-2 pl-8 block"
      >
        <option value={Theme.System}>{t("system")}</option>
        <option value={Theme.Dark}>{t("dark")}</option>
        <option value={Theme.Light}>{t("light")}</option>
      </select>
    </div>
  );
};

export default ModeSelect;
