import React from 'react'

import { GA_TRACKING_ID } from '../lib/analytics'
import { oneLine } from '../lib/util'

const AnalyticsHeadTags = () => {
  return process.env.NODE_ENV !== 'development' ? (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: oneLine(`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `)
        }}
      />
    </>
  ) : null
}

export default AnalyticsHeadTags
