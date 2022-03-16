import React, { FunctionComponent } from 'react'
import Head from 'next/head'

type Props = {
  title?: string
  description?: string
}

const Layout: FunctionComponent<Props> = ({
  children,
  title = 'bedrock.dev',
  description= '',
}) => (
  <>
    <Head>
      <title>{title}</title>
      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
        </>
      )}
      <meta property='og:title' content={title} />
    </Head>
    {children}
  </>
)

export default Layout
