import { useState, useEffect, useCallback } from "react";

export enum Theme {
  System = "system",
  Light = "light",
  Dark = "dark",
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (import.meta.env.SSR) return Theme.System;
    const stored = localStorage.getItem("theme");
    if (
      stored === Theme.Light ||
      stored === Theme.Dark ||
      stored === Theme.System
    ) {
      return stored as Theme;
    }
    return Theme.System;
  });

  const [resolvedTheme, setResolvedTheme] = useState<Theme.Light | Theme.Dark>(
    () => {
      if (import.meta.env.SSR) return Theme.Light;
      const stored = localStorage.getItem("theme");
      const t =
        stored === Theme.Light ||
        stored === Theme.Dark ||
        stored === Theme.System
          ? (stored as Theme)
          : Theme.System;

      if (t === Theme.System) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? Theme.Dark
          : Theme.Light;
      }
      return t as Theme.Light | Theme.Dark;
    },
  );

  const applyTheme = useCallback((newTheme: Theme) => {
    const resolved =
      newTheme === Theme.System
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? Theme.Dark
          : Theme.Light
        : (newTheme as Theme.Light | Theme.Dark);

    document.documentElement.classList.remove(Theme.Light, Theme.Dark);
    document.documentElement.classList.add(resolved);

    // Update theme-color meta tag
    const themeColor = resolved === Theme.Light ? "#f9fafb" : "#18191a";
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", themeColor);
    }

    return resolved;
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      localStorage.setItem("theme", newTheme);
      setThemeState(newTheme);
      const resolved = applyTheme(newTheme);
      setResolvedTheme(resolved);
    },
    [applyTheme],
  );

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const stored = localStorage.getItem("theme");
      if (!stored || stored === Theme.System) {
        const resolved = applyTheme(Theme.System);
        setResolvedTheme(resolved);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // Listen for theme changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as Theme;
        setThemeState(newTheme);
        const resolved = applyTheme(newTheme);
        setResolvedTheme(resolved);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, [applyTheme]);

  return { theme, resolvedTheme, setTheme };
}
