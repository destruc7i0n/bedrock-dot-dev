import { useEffect, useState } from "react";

import { ChevronUpIcon } from "@heroicons/react/20/solid";

const BackToTop = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return showScroll ? (
    <button
      className="scroll-button flex items-center justify-center rounded-lg bg-blue-500 px-1.5 py-1.5 font-bold text-white transition duration-150 ease-in-out hover:bg-blue-700"
      onClick={scrollTop}
    >
      <ChevronUpIcon className="h-6 w-6" />
    </button>
  ) : null;
};

export default BackToTop;
