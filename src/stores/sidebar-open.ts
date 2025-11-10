import { atom } from "nanostores";
import { MOBILE_BREAKPOINT } from "@lib/breakpoints";

const getInitialValue = (): boolean => {
  if (typeof window === "undefined") return true;

  // always closed by default on mobile, regardless of localStorage
  const mobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  if (mobile.matches) return false;

  try {
    const stored = localStorage.getItem("sidebar");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed?.open === "boolean") {
        return parsed.open;
      }
    }
  } catch {}

  return true;
};

export const sidebarOpen = atom<boolean>(getInitialValue());

// Persist changes to localStorage
if (typeof window !== "undefined") {
  sidebarOpen.subscribe((value) => {
    try {
      localStorage.setItem("sidebar", JSON.stringify({ open: value }));
    } catch {
      // Ignore storage errors (quota exceeded, disabled, etc.)
    }
  });
}
