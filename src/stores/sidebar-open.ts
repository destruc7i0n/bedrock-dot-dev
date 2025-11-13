import { persistentAtom } from "@nanostores/persistent";
import { MOBILE_BREAKPOINT } from "@lib/constants/breakpoints";

const getDefaultValue = (): boolean => {
  if (typeof window === "undefined") return true;
  const mobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  return !mobile.matches;
};

export const sidebarOpen = persistentAtom<boolean>(
  "sidebar",
  getDefaultValue(),
  {
    encode: (value) => String(value),
    decode: (str) => str === "true",
  },
);
