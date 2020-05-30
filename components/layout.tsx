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
  <>
    <Head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <NextSeo title={title} {...description && { description }} twitter={{ handle: '@TheDestruc7i0n' }} />
    {header && <Header/>}
    <div>
      {children}
    </div>
  </>
)

export default Layout
