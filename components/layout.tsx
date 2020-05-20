import React, { FunctionComponent } from 'react'
import Head from 'next/head'

import { NextSeo } from 'next-seo'

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
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <NextSeo title={title} {...description && { description }} />
    {header && <Header/>}
    <div className='h-screen'>
      {children}
    </div>
  </div>
)

export default Layout
