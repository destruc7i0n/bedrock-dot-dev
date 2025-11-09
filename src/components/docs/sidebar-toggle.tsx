import { FunctionComponent } from "react";
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
    <div className="flex mr-2">
      <button
        onClick={handleToggle}
        className="no-double-tap-zoom"
        aria-label="Toggle sidebar"
      >
        <IconClass className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SidebarToggle;
