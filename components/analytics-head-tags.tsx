import React, { memo } from 'react'

const AnalyticsHeadTags = () => {
  return process.env.GA_TRACKING_ID ? (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GA_TRACKING_ID}');
        `,
        }}
      />
    </>
  ) : null
}

export default memo(AnalyticsHeadTags)
