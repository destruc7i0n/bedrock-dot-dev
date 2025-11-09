import { FunctionComponent, useEffect, useState } from "react";
import cn from "classnames";
import { useStore } from "@nanostores/react";
import { sidebarOpen } from "@stores/sidebar-open";
import SidebarMask from "./sidebar-mask";
import { useIsMobile } from "@hooks/media-query";

interface Props {
  children: React.ReactNode;
}

const SidebarContainer: FunctionComponent<Props> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const mobile = useIsMobile();
  const $open = useStore(sidebarOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobile) {
      document.body.style.overflow = $open ? "hidden" : "initial";
    }
    return () => {
      document.body.style.overflow = "initial";
    };
  }, [$open, mobile]);

  useEffect(() => {
    if ($open) {
      // remove the class from the preflight if it's there
      if (document.documentElement.classList.contains("sidebar-closed")) {
        document.documentElement.classList.remove("sidebar-closed");
      }
    }
  }, [$open]);

  return (
    <>
      {$open && mobile && mounted && <SidebarMask />}
      <aside className={cn("sidebar", { open: $open, mounted })}>
        {children}
      </aside>
    </>
  );
};

export default SidebarContainer;
