export const GA_TRACKING_ID = "UA-140324586-1";

// log pageview if tracking id specified
export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !('gtag' in window)) return;

  try {
    // @ts-expect-error - gtag is added by Google Analytics script
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
      page_title: document.title,
    });
  } catch (err) {
    console.error("Error in analytics: pageview;", err);
  }
};
