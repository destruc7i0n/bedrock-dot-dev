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
          <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
          <link rel='manifest' href='/favicon/site.webmanifest' />
          <link rel='shortcut icon' href='/favicon/favicon.ico' />
          <meta name='theme-color' content='#ffffff' />
          <AnalyticsHeadTags />
          <script
            dangerouslySetInnerHTML={{ __html: `
            try {
              var sidebar = window.localStorage.getItem('sidebar');
              if (sidebar) {
                var open = JSON.parse(sidebar).open;
                if (!open) document.documentElement.classList.add('sidebar-closed');
              }
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
