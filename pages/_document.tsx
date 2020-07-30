import React from 'react'

import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

import AnalyticsHeadTags from 'components/analytics-head-tags'

class BedrockDevDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta charSet='utf-8' />
          <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
          <link rel='manifest' href='/favicon/site.webmanifest' />
          <link rel='shortcut icon' href='/favicon/favicon.ico' />
          <meta name='theme-color' content='#ffffff' />
          <meta name='twitter:card' content='summary' />
          <meta name='twitter:creator' content='@TheDestruc7i0n' />
          <meta name='twitter:image' content='https://bedrock.dev/favicon/android-chrome-512x512.png' />
          <meta name='og:image' content='https://bedrock.dev/favicon/android-chrome-512x512.png' />
          <AnalyticsHeadTags />
          <script
            dangerouslySetInnerHTML={{ __html: `
            try {
              var query = window.matchMedia('(prefers-color-scheme: dark)')
              var pref = window.localStorage.getItem('theme')
              
              if (pref && pref === 'dark') document.documentElement.classList.add('dark-mode')
              if (!pref && query.matches) document.documentElement.classList.add('dark-mode')
            } catch (e) {}
            `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default BedrockDevDocument
