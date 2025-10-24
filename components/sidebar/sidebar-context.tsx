import React, {
  createContext,
  useEffect,
  useState,
  FunctionComponent,
  useSyncExternalStore,
} from "react";

import { isLg } from "hooks/media-query";

type ContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SidebarContext = createContext<ContextType>({
  open: true,
  setOpen: () => null,
});

let count = -1;
let lastClick: number = 0;

export const SidebarContextProvider: FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const getInitialOpen = () => {
    if (typeof window === "undefined") return true;

    let newOpen = true;
    try {
      const localStorageItem = localStorage.getItem("sidebar");
      if (typeof localStorageItem === "string") {
        ({ open: newOpen } = JSON.parse(localStorageItem));
      }
    } catch {
      // ignore errors
    }

    // not open if on small screen
    if (!isLg()) newOpen = false;

    return newOpen;
  };

  const [open, setOpen] = useState<boolean>(getInitialOpen);

  // Check if we're mounted (client-side)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Remove preflight class on mount
  useEffect(() => {
    if (
      mounted &&
      document.documentElement.classList.contains("sidebar-closed")
    ) {
      document.documentElement.classList.remove("sidebar-closed");
    }
  }, [mounted]);

  // update localstorage on sidebar change
  useEffect(() => {
    // only update when on large screen
    if (isLg()) {
      try {
        localStorage.setItem("sidebar", JSON.stringify({ open }));
      } catch {
        // ignore storage errors
      }
    }

    if (Date.now() - lastClick > 750) count = 0;
    lastClick = Date.now();
    count += 1;

    if (count >= 7) {
      count = 0;
      document.documentElement.classList.toggle("monocraft");
    }
  }, [open]);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};
