import type { FunctionComponent } from "react";
import { Bars3Icon, Bars3CenterLeftIcon } from "@heroicons/react/20/solid";
import { useStore } from "@nanostores/react";
import { sidebarOpen } from "@stores/sidebar-open";

const SidebarToggle: FunctionComponent = () => {
  const $open = useStore(sidebarOpen);
  const IconClass = $open ? Bars3CenterLeftIcon : Bars3Icon;

  const handleToggle = () => {
    sidebarOpen.set(!$open);
  };

  return (
    <div className="mr-2 flex">
      <button
        onClick={handleToggle}
        className="no-double-tap-zoom"
        aria-label="Toggle sidebar"
      >
        <IconClass className="h-6 w-6" />
      </button>
    </div>
  );
};

export default SidebarToggle;
