import React, { FunctionComponent } from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Error from 'next/error'

import { extractDataFromHtml, ParseHtmlResponse } from 'lib/html'
import { cleanHtmlForDisplay } from 'lib/html/clean'
import { highlightHtml } from 'lib/html/highlight'

import Layout from 'components/layout'
import Sidebar, { SidebarStructure } from 'components/sidebar'
import DocsContainer from 'components/docs-container'
import VersionContext from 'components/version-context'
import { SidebarContextProvider } from 'components/sidebar/sidebar-context'
import useLoading from 'components/loading'

import { getBedrockVersions, getTags } from 'lib/files'
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
    } else {
      return <Error statusCode={404} />
    }
  }

  const sidebar: SidebarStructure = (parsedData && parsedData.sidebar) || {}
  let title = 'Loading...'
  let description = ''
  if (!loading && parsedData.title) {
    const { title: documentTitle, version } = parsedData.title
    title = `${documentTitle} Documentation | ${version} | bedrock.dev`
    description = `Minecraft Bedrock ${documentTitle} Documentation Version ${version}`
  }

  // transform to string representation
  let versions = {}
  if (bedrockVersions) versions = transformInbound(bedrockVersions)

  return (
    <>
      <Head>
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
      <VersionContext.Provider value={{ major, minor, file, versions }}>
        <SidebarContextProvider>
          <Layout title={title} description={description}>
            <div className='flex'>
              <Sidebar sidebar={sidebar} file={file} loading={loading} />
              <DocsContainer html={html} loading={loading} />
            </div>
          </Layout>
        </SidebarContextProvider>
      </VersionContext.Provider>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const bedrockVersions = await getBedrockVersions()

  const tags = await getTags()
  const { beta: [ betaMajor ], stable: [ stableMajor ] } = tags

  let paths = []
  for (let major of Object.keys(bedrockVersions)) {
    for (let minor of Object.keys(bedrockVersions[major])) {
      if (process.env.NODE_ENV === 'production') {
        if (![betaMajor, stableMajor].includes(major)) continue
      }
      for (let file of bedrockVersions[major][minor]) {
        paths.push({params: {slug: [major, minor, file]}})
      }
    }
  }

  return { paths, fallback: true }
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
      displayHtml = cleanHtmlForDisplay(html)
      displayHtml = highlightHtml(displayHtml, slug[2])

      let file = ''
      if (slug && slug.length === 3) file = slug[2]

      const path = slug.join('/')
      Log.info(`Processing ${logLinkColor(path)}...`)
      parsedData = extractDataFromHtml(html, file)
      Log.info('Done processing ' + logLinkColor(path))
    }
  }

  return { props: { html: displayHtml, bedrockVersions, parsedData } }
}

export default Docs
