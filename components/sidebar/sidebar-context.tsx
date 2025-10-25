import React, {
  createContext,
  useEffect,
  useState,
  FunctionComponent,
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
  const [open, setOpen] = useState<boolean>(true);

  // rehydrate the open state from localStorage after mount
  useEffect(() => {
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

    if (open !== newOpen) {
      setOpen(newOpen);
    }

    // remove the class from the preflight if it's there
    if (document.documentElement.classList.contains("sidebar-closed")) {
      document.documentElement.classList.remove("sidebar-closed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
