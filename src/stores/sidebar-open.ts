import { atom } from "nanostores";

const getInitialValue = (): boolean => {
  if (typeof window === "undefined") return true;

  try {
    const stored = localStorage.getItem("sidebar");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed?.open === "boolean") {
        return parsed.open;
      }
    }
  } catch {
    // Ignore errors (invalid JSON, storage disabled, etc.)
  }

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
