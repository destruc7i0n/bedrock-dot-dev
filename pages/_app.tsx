import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import Router from 'next/router'

import { ThemeProvider } from 'next-themes'

import { appWithTranslation } from 'next-i18next'

import NProgress from 'nprogress'

import * as analytics from 'lib/analytics'

import 'styles/tailwind.scss'
import 'styles/app.scss'

NProgress.configure({ showSpinner: false })

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', (url: string) => {
  NProgress.done()
  analytics.pageview(url)
})

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log('Hey there!')
  }, [])

  return (
    <ThemeProvider defaultTheme='system' attribute='class' disableTransitionOnChange>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default appWithTranslation(App)
