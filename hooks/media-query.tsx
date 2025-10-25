import { useState, useCallback, useEffect } from "react";

// from https://github.com/zeit/next-site/blob/master/components/media-query.js

const getMediaQuery = (width: number): MediaQueryList | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.matchMedia && window.matchMedia(`(max-width: ${width}px)`);
};

const isLg = () => !(getMediaQuery(1024)?.matches ?? true);

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(
    () => getMediaQuery(width)?.matches ?? false,
  );

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = getMediaQuery(width);
    if (!media) return;

    media.addEventListener("change", updateTarget);

    return () => media.removeEventListener("change", updateTarget);
  }, [updateTarget, width]);

  return targetReached;
};

const useIsMobile = () => {
  return useMediaQuery(1024);
};

export { useMediaQuery, getMediaQuery, useIsMobile, isLg };
