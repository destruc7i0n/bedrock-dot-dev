import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import Router from 'next/router'

import { ThemeProvider } from 'next-themes'

import { appWithTranslation } from 'next-i18next'

import NProgress from 'nprogress'

import * as analytics from 'lib/analytics'

import 'styles/tailwind.scss'
import 'styles/fonts.scss'
import 'styles/app.scss'

NProgress.configure({ showSpinner: false })

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', (url: string) => {
  NProgress.done()
  analytics.pageview(url)

  // https://github.com/vercel/next.js/issues/5161#issuecomment-421197307
  setTimeout(() => {
    if (location.hash) location = location
  }, 0)
})

// Router.events.on('hashChangeStart', () => console.log('hashChangeStart'))
// Router.events.on('hashChangeComplete', () => console.log('hashChangeComplete'))

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
