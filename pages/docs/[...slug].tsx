import React, { FunctionComponent } from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Error from 'next/error'

import { extractDataFromHtml, ParseHtmlResponse } from 'lib/html'
import { cleanHtmlForDisplay } from 'lib/html/clean'
import { highlightHtml } from 'lib/html/highlight'

import Layout from 'components/layout'
import Header from 'components/docs/header'
import Footer from 'components/footer'
import Sidebar, { SidebarStructure } from 'components/sidebar'
import DocsContainer from 'components/docs/docs-container'
import { VersionContextProvider } from 'components/version-context'
import { SidebarContextProvider } from 'components/sidebar/sidebar-context'
import BackToTop from 'components/docs/back-to-top'

import useLoading from 'hooks/loading'

import { getTags, Tags, TagsResponse } from 'lib/tags'
import { getDocsFilesFromRepo } from 'lib/github/raw'
import Log, { logLinkColor } from 'lib/log'
import {
  bedrockVersionsInOrder,
  TransformedOutbound,
  transformInbound,
  transformOutbound
} from 'lib/bedrock-versions-transformer'
import { areVersionsEqual, getTagFromSlug, getVersionParts, oneLine } from 'lib/util'
import { allFilesList } from 'lib/versions'

// extract type from inside a promise
type ReturnTypePromise<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any
type PathsType = ReturnTypePromise<GetStaticPaths>['paths']

type Props = {
  html: string
  bedrockVersions: TransformedOutbound
  tags: TagsResponse
  parsedData: ParseHtmlResponse
  version: string[]
}

const Docs: FunctionComponent<Props> = ({ html, bedrockVersions, tags, parsedData, version }) => {
  const { isFallback, query: { slug } } = useRouter()

  let [ major, minor, file ] = (version || [ '', '', '' ])

  let versionTag: Tags | null = getTagFromSlug(slug)

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
  if (parsedData?.title) {
    const { title: documentTitle, version } = parsedData.title
    title = `${documentTitle} Documentation | ${version} | bedrock.dev`
    description = `Minecraft Bedrock ${documentTitle} Documentation Version ${version}`

    // custom titles for version tag
    if (versionTag) {
      switch (versionTag) {
        case Tags.Stable: {
          title = `${documentTitle} Documentation | bedrock.dev`
          description = `Minecraft Bedrock ${documentTitle} Documentation`
          break
        }
        case Tags.Beta: {
          title = `Beta ${documentTitle} Documentation | bedrock.dev`
          description = `Minecraft Bedrock Beta ${documentTitle} Documentation`
          break
        }
        default: break
      }
    }
  }

  // transform to string representation
  let versions = {}
  if (bedrockVersions) versions = transformInbound(bedrockVersions)

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: oneLine(`
            try {
              var sidebar = window.localStorage.getItem('sidebar');
              if (sidebar) {
                var open = JSON.parse(sidebar).open;
                if (!open) document.documentElement.classList.add('sidebar-closed');
              }
            } catch (e) {}
            `
          )}}
        />
      </Head>
      <VersionContextProvider value={{ major, minor, file, versions, tags }}>
        <SidebarContextProvider>
          <Layout title={title} description={description}>
            <Header />
            <div className='flex'>
              <Sidebar sidebar={sidebar} file={file} loading={loading} />
              <DocsContainer html={html} loading={loading} />
            </div>
            <BackToTop />
            {!loading && <Footer dark darkClassName='bg-dark-gray-975' modeSelect={false} outline />}
          </Layout>
        </SidebarContextProvider>
      </VersionContextProvider>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const bedrockVersions = await allFilesList()
  const tags = await getTags()

  let paths: PathsType = []

  const stableVersionParts = getVersionParts(tags[Tags.Stable][1])

  for (let [ major, minor, files ] of bedrockVersionsInOrder(bedrockVersions)) {
    for (let file of files) {
      file = encodeURI(file)
      const version = [ major, minor ]

      const versionParts = getVersionParts(major)

      let shouldPreload = versionParts[1] >= stableVersionParts[1]

      // handle stable and beta routes
      if (areVersionsEqual(version, tags[Tags.Stable])) {
        paths.push({ params: {slug: ['stable', file]} })
        shouldPreload = true
      } else if (areVersionsEqual(version, tags[Tags.Beta])) {
        paths.push({ params: {slug: ['beta', file]} })
        shouldPreload = true
      }

      if (shouldPreload) {
        paths.push({params: {slug: [major, minor, file]}})
      }
    }
  }

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let html: string | null = null
  let displayHtml: string | null = null
  let parsedData: ParseHtmlResponse | null = null

  if (!params) return { notFound: true }

  const { slug } = params
  let version: string[] = []

  // transform to "compressed" version
  const bedrockVersions = transformOutbound(await allFilesList())
  const tags = await getTags()

  // [ major, minor, file ]
  if (typeof slug === 'object' && slug.length >= 2) {
    version = [ ...slug ]
    // make sure to decode the file name
    version[version.length - 1] = decodeURI(version[version.length - 1])

    // check if tagged version in slug
    const versionTag = getTagFromSlug(slug)
    switch (versionTag) {
      case 'stable': {
        version = [ ...tags.stable, slug[1] ]
        break
      }
      case 'beta': {
        version = [ ...tags.beta, slug[1] ]
        break
      }
      default: break
    }

    const file = version[2]
    const path = version.join('/')

    try {
      html = await getDocsFilesFromRepo(path)
    } catch (e) {
      Log.error(`Could not get file for "${path}"!`)
      return { notFound: true }
    }

    // the html to be presented on the site
    displayHtml = cleanHtmlForDisplay(html, file, version[1])
    displayHtml = highlightHtml(displayHtml, file)

    Log.info(`Processing ${logLinkColor(path)}...`)
    parsedData = extractDataFromHtml(html, file)
    Log.info('Done processing ' + logLinkColor(path))
  }

  return {
    props: { html: displayHtml, bedrockVersions, tags, parsedData, version },
    revalidate: 60 * 60, // every 1 hour
  }
}

export default Docs
