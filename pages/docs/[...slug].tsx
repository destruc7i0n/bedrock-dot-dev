import React, { FunctionComponent } from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Error from 'next/error'

import { highlightTextarea, parseHtml, ParseHtmlResponse, removeDisplayHtml } from 'lib/html'

import Layout from 'components/layout'
import Sidebar  from 'components/sidebar'
import DocsContainer from 'components/docs-container'
import VersionContext from 'components/version-context'
import { SidebarContextProvider } from 'components/sidebar/sidebar-context'
import useLoading from 'components/loading'

import { getBedrockVersions } from 'lib/files'
import { getDocsFilesFromRepo } from 'lib/github/raw'
import Log, { logLinkColor } from 'lib/log'
import { transformOutbound, transformInbound, TransformedOutbound } from 'lib/bedrock-versions-transformer'

type Props = {
  html: string
  bedrockVersions: TransformedOutbound,
  parsedData: ParseHtmlResponse,
}

const Docs: FunctionComponent<Props> = ({ html, bedrockVersions, parsedData }) => {
  const { isFallback, query } = useRouter()
  const { slug } = query

  let major = '', minor = '', file = ''
  if (slug && typeof slug === 'object') [ major, minor, file ] = slug

  // when the page is transitioning, in a loading state
  let loading = useLoading()

  // while loading, probably during fallback mode
  if (!html || !parsedData || !bedrockVersions) {
    if (isFallback) {
      loading = true
      parsedData = {
        title: 'Loading...',
        sidebar: {},
      }
    } else {
      return <Error statusCode={404} />
    }
  }

  const title = parsedData?.title
  const description = parsedData?.title && `Minecraft Bedrock ${parsedData.title}`

  // transform to string representation
  let versions = {}
  if (bedrockVersions) versions = transformInbound(bedrockVersions)

  return (
    <VersionContext.Provider value={{ major, minor, file, versions }}>
      <SidebarContextProvider>
        <Layout title={title} description={description}>
          <div className='flex'>
            <Sidebar sidebar={parsedData && parsedData.sidebar} file={file} loading={loading} />
            <DocsContainer html={html} loading={loading} />
          </div>
        </Layout>
      </SidebarContextProvider>
    </VersionContext.Provider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const bedrockVersions = await getBedrockVersions()

  let paths = []
  for (let major of Object.keys(bedrockVersions)) {
    for (let minor of Object.keys(bedrockVersions[major])) {
      for (let file of bedrockVersions[major][minor]) {
        paths.push({params: {slug: [major, minor, file]}})
      }
    }
  }

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let html = null
  let displayHtml = null
  let parsedData = null

  if (!params) return { props: { html } }

  const { slug } = params

  // transform to "compressed" version
  const bedrockVersions = transformOutbound(await getBedrockVersions())

  if (typeof slug === 'object' && slug.length === 3) {
    let path = [ ...slug ]
    // when there is only one file available
    if (path[0] === path[1]) path = [ path[0], path[2] ]

    try {
      html = await getDocsFilesFromRepo(path.join('/'))
    } catch (e) {
      Log.error('Could not get file!')
    }

    if (typeof html === 'string') {
      displayHtml = html ? highlightTextarea(removeDisplayHtml(html), slug[2]) : ''

      let file = ''
      if (slug && slug.length === 3) file = slug[2]

      const path = slug.join('/')
      Log.info(`Processing ${logLinkColor(path)}...`)
      parsedData = parseHtml(html, file)
      Log.info('Done processing ' + logLinkColor(path))
    }
  }

  return { props: { html: displayHtml, bedrockVersions, parsedData } }
}

export default Docs
