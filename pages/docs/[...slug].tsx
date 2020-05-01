import React from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Error from 'next/error'

import { BedrockVersions } from '../api/docs/list'

import { parseHtml, ParseHtmlResponse, removeDisplayHtml } from '../../lib/html'

import Layout from '../../components/layout'
import Sidebar  from '../../components/sidebar'
import DocsContainer from '../../components/docs-container'
import VersionContext from '../../components/version-context'
import { SidebarContextProvider } from '../../components/sidebar/sidebar-context'
import Loading from '../../components/loading'

import { useScrollController } from '../../components/scroll-controller'
import { useIsMobile } from '../../components/media-query';

import { getBedrockVersions } from '../../lib/files'
import { getDocsFilesFromRepo } from '../../lib/github/raw'

type Props = {
  html: string
  bedrockVersions: BedrockVersions,
  parsedData: ParseHtmlResponse
}

const Docs = ({ html, bedrockVersions, parsedData }: Props) => {
  const { isFallback, query } = useRouter()
  const { slug } = query

  let major = '', minor = '', file = ''
  if (slug) [ major, minor, file ] = slug

  const isMobile = useIsMobile()

  useScrollController()

  // while loading...
  if (!html || !parsedData || !bedrockVersions) {
    if (isFallback) {
      return (
        <VersionContext.Provider value={{ major, minor, file, versions: bedrockVersions }}>
          <Layout title={'Loading...'}>
            <Loading />
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
        <Layout title={parsedData && parsedData.title}>
          <Sidebar sidebar={parsedData && parsedData.sidebar} mobile={isMobile} />
          <DocsContainer html={html} />
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

  return { paths, fallback: true }
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
  }

  if (typeof html === 'string') {
    displayHtml = html ? removeDisplayHtml(html) : ''

    let file = ''
    if (slug && slug.length === 3) file = slug[2]

    parsedData = parseHtml(html, file)
  }

  return { props: { html: displayHtml, bedrockVersions, parsedData } }
}

export default Docs
