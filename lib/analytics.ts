// log pageview if tracking id specified
export const pageview = (url: string) => {
  if (!process.env.GA_TRACKING_ID) return

  try {
    // @ts-ignore
    window.gtag('config', process.env.GA_TRACKING_ID, {
      page_location: url,
      page_title: document.title
    })
  } catch (err) {
    console.error('Error in analytics: pageview;', err)
  }
}
