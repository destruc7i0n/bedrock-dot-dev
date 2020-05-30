import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import Router from 'next/router'

import NProgress from 'nprogress'

import 'styles/app.scss'

NProgress.configure({ showSpinner: false })

Router.events.on('routeChangeStart', () => NProgress.start())

Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', (url: string) => {
  NProgress.done()

  // log to analytics, only on production
  if (process.env.GA_TRACKING_ID) {
    setTimeout(() => {
      // @ts-ignore
      window.gtag && window.gtag('config', process.env.GA_TRACKING_ID, {
        page_location: url,
        page_title: document.title,
      })
    }, 0)
  }
})

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log('Hey there!')
  }, [])

  return (
    <Component {...pageProps} />
  )
}

export default App
