import React, { FunctionComponent } from 'react'
import Head from 'next/head'

import Header from './header'

type Props = {
  title?: string
}

const Layout: FunctionComponent<Props> = ({
  children,
  title = 'bedrock.dev',
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <Header />
    <div className='container-fluid'>
      {children}
    </div>
  </div>
)

export default Layout
