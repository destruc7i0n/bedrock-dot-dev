export const GA_TRACKING_ID = "UA-140324586-1";

// log pageview if tracking id specified
export const pageview = (url: string) => {
  if (!window.hasOwnProperty("gtag")) return;

  try {
    // @ts-ignore
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
      page_title: document.title,
    });
  } catch (err) {
    console.error("Error in analytics: pageview;", err);
  }
};
