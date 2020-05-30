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
          <AnalyticsHeadTags />
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
