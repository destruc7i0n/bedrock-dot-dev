import React, { FunctionComponent } from 'react'
import Head from 'next/head'

import Header from './header'

type Props = {
  title?: string
  description?: string
  header?: boolean
}

const Layout: FunctionComponent<Props> = ({
  children,
  title = 'bedrock.dev',
  description= '',
  header = true
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
    {header && <Header/>}
    <div>
      {children}
    </div>
  </>
)

export default Layout
