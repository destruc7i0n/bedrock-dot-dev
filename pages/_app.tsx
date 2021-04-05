import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import Router from 'next/router'

import { ThemeProvider } from 'next-themes'

import { appWithTranslation } from 'next-i18next'

import ProgressBar from '@badrap/bar-of-progress'

import * as analytics from 'lib/analytics'

import 'styles/tailwind.scss'
import 'styles/app.scss'

const progress = new ProgressBar({
  size: 2,
  color: '#29e',
  className: 'bar-of-progress',
  delay: 80,
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeError', progress.finish)
Router.events.on('routeChangeComplete', (url: string) => {
  progress.finish()
  analytics.pageview(url)
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
