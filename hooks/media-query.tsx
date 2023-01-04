import { useState, useCallback, useEffect } from "react";

// from https://github.com/zeit/next-site/blob/master/components/media-query.js

const getMediaQuery = (width: number) => {
  return (
    (window.matchMedia && window.matchMedia(`(max-width: ${width}px)`)) || {
      matches: false,
    }
  );
};

const isLg = () => !getMediaQuery(1024).matches;

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = getMediaQuery(width);
    media.addListener(updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeListener(updateTarget);
  }, []);

  return targetReached;
};

const useIsMobile = () => {
  return useMediaQuery(1024);
};

export { useMediaQuery, getMediaQuery, useIsMobile, isLg };
