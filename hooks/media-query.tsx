import { useState, useCallback, useEffect } from "react";

// from https://github.com/zeit/next-site/blob/master/components/media-query.js

const getMediaQuery = (width: number) => {
  return (
    (window.matchMedia && window.matchMedia(`(max-width: ${width}px)`)) || {
      matches: false,
    }
  );
};

const isLg = () => {
  if (typeof window === 'undefined') return true;
  return !getMediaQuery(1024).matches;
};

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(() => {
    if (typeof window === 'undefined') return false;
    return getMediaQuery(width).matches;
  });

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = getMediaQuery(width);
    media.addEventListener('change', updateTarget);

    return () => media.removeEventListener('change', updateTarget);
  }, [updateTarget, width]);

  return targetReached;
};

const useIsMobile = () => {
  return useMediaQuery(1024);
};

export { useMediaQuery, getMediaQuery, useIsMobile, isLg };
