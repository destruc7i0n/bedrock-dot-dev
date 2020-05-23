import React, { FunctionComponent } from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Error from 'next/error'

import { BedrockVersions } from 'lib/versions'

import { highlightTextarea, parseHtml, ParseHtmlResponse, removeDisplayHtml } from 'lib/html'

import Layout from 'components/layout'
import Sidebar  from 'components/sidebar'
import DocsContainer from 'components/docs-container'
import VersionContext from 'components/version-context'
import { SidebarContextProvider } from 'components/sidebar/sidebar-context'
import LoadingText from 'components/loading-text'
import useLoading from 'components/loading'

import { useScrollController } from 'components/scroll-controller'

import { getBedrockVersions } from 'lib/files'
import { getDocsFilesFromRepo } from 'lib/github/raw'

type Props = {
  html: string
  bedrockVersions: BedrockVersions,
  parsedData: ParseHtmlResponse,
}

const Docs: FunctionComponent<Props> = ({ html, bedrockVersions, parsedData }) => {
  const { isFallback, query } = useRouter()
  const { slug } = query

  let major = '', minor = '', file = ''
  if (slug) [ major, minor, file ] = slug

  useScrollController()

  const loading = useLoading()

  // while loading...
  if (!html || !parsedData || !bedrockVersions) {
    if (isFallback) {
      return (
        <VersionContext.Provider value={{ major, minor, file, versions: bedrockVersions }}>
          <Layout title='Loading...'>
            <LoadingText />
          </Layout>
        </VersionContext.Provider>
      )
    } else {
      return <Error statusCode={404} />
    }
  }

  return (
    <VersionContext.Provider value={{ major, minor, file, versions: bedrockVersions }}>
      <SidebarContextProvider>
        <Layout title={parsedData && parsedData.title} description={parsedData && parsedData.title}>
          <Sidebar sidebar={parsedData && parsedData.sidebar} file={file} loading={loading} />
          <DocsContainer html={html} sidebarIds={parsedData && parsedData.sidebarIds} loading={loading} />
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

  const bedrockVersions = await getBedrockVersions()

  if (typeof slug === 'object' && slug.length === 3) {
    let path = [ ...slug ]
    // when there is only one file available
    if (path[0] === path[1]) path = [ path[0], path[2] ]

    try {
      html = await getDocsFilesFromRepo(path.join('/'))
    } catch (e) {
      console.log('Could not get file!')
    }

    if (typeof html === 'string') {
      displayHtml = html ? highlightTextarea(removeDisplayHtml(html), slug[2]) : ''

      let file = ''
      if (slug && slug.length === 3) file = slug[2]

      parsedData = parseHtml(html, file)
    }
  }

  return { props: { html: displayHtml, bedrockVersions, parsedData } }
}

export default Docs
