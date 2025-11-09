import { FunctionComponent, memo } from "react";

import { sidebarOpen } from "@stores/sidebar";

const SidebarMask: FunctionComponent = () => {
  return (
    <div className="sidebar-mask" onClick={() => sidebarOpen.set(false)} />
  );
};

export default memo(SidebarMask);
