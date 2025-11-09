import { atom } from "nanostores";
import { isLg } from "@hooks/media-query";

// Easter egg counter variables
let count = -1;
let lastClick: number = 0;

// Get initial state synchronously
function getInitialSidebarState(): boolean {
  if (typeof window === "undefined") {
    return true; // SSR default
  }

  let storedOpen = true;

  try {
    const stored = localStorage.getItem("sidebar");
    if (stored) {
      ({ open: storedOpen } = JSON.parse(stored));
    }
  } catch {
    // Ignore errors
  }

  // Close on small screens
  if (!isLg()) {
    storedOpen = false;
  }

  return storedOpen;
}

export const sidebarOpen = atom<boolean>(
  typeof window !== "undefined" ? getInitialSidebarState() : true,
);

if (typeof window !== "undefined") {
  sidebarOpen.subscribe((open) => {
    if (isLg()) {
      try {
        localStorage.setItem("sidebar", JSON.stringify({ open }));
      } catch {
        // Ignore storage errors
      }
    }

    // Update DOM class
    if (open) {
      document.documentElement.classList.remove("sidebar-closed");
    } else {
      document.documentElement.classList.add("sidebar-closed");
    }

    // Easter egg: rapid clicks toggle monocraft font
    if (Date.now() - lastClick > 750) count = 0;
    lastClick = Date.now();
    count += 1;

    if (count >= 7) {
      count = 0;
      document.documentElement.classList.toggle("monocraft");
    }
  });
}
