import React, { FunctionComponent } from 'react'
import Head from 'next/head'

import Header from './header'

import { BedrockVersions } from '../pages/api/docs/list'

type Props = {
  title?: string
  versions?: BedrockVersions
}

const Layout: FunctionComponent<Props> = ({
  children,
  title = 'bedrock.dev',
  versions,
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <Header versions={versions} />
    <div className='container-fluid'>
      {children}
    </div>
  </div>
)

export default Layout
