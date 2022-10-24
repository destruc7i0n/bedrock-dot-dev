import React, { FunctionComponent } from 'react'

import { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Error from 'next/error'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { extractDataFromHtml, ParseHtmlResponse, fetchHtml } from 'lib/html'

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
import Log, { logLinkColor } from 'lib/log'
import {
  bedrockVersionsInOrder,
  TransformedOutbound,
  transformInbound,
  transformOutbound
} from 'lib/bedrock-versions-transformer'
import { areVersionsEqual, getTagFromSlug, getVersionParts, oneLine } from 'lib/util'
import { allFilesList } from 'lib/versions'
import { getLocale, Locale, useLocale } from 'lib/i18n'
import { VERCEL_URL_PREFIX } from 'lib/constants'

type Props = {
  html: string
  bedrockVersions: TransformedOutbound
  tags: TagsResponse
  parsedData: ParseHtmlResponse
  version: string[]
}

const Docs: FunctionComponent<Props> = ({ html, bedrockVersions, tags, parsedData, version }) => {
  const { t } = useTranslation('common')

  const { isFallback, query: { slug } } = useRouter()
  const locale = useLocale()

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
  let title = t('page.docs.website_title_loading')
  let description = ''
  let ogImageUrl = `${VERCEL_URL_PREFIX}/api/og?file=${encodeURIComponent(file)}`

  if (parsedData?.title) {
    const { title: documentTitle, version } = parsedData.title
    title = t('page.docs.website_title_untagged', { title: documentTitle, version }) + ' | bedrock.dev'
    description = t('page.docs.website_description_untagged', { title: documentTitle, version })

    // custom titles for version tag
    if (versionTag) {
      ogImageUrl += `&version=${encodeURIComponent(versionTag)}`

      switch (versionTag) {
        case Tags.Stable: {
          title = t('page.docs.website_title_tagged_stable', { title: documentTitle }) + ' | bedrock.dev'
          description = t('page.docs.website_description_tagged_stable', { title: documentTitle })
          break
        }
        case Tags.Beta: {
          title = t('page.docs.website_title_tagged_beta', { title: documentTitle }) + ' | bedrock.dev'
          description = t('page.docs.website_description_tagged_beta', { title: documentTitle })
          break
        }
        default: break
      }
    } else {
      ogImageUrl += `&version=${encodeURIComponent(version)}`
    }
  }

  // transform to string representation
  let versions = {}
  if (bedrockVersions) versions = transformInbound(bedrockVersions)

  return (
    <Layout title={title} description={description}>
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
        <meta name='docsearch:language' content={locale} />
        <meta key='meta-image' name='og:image' content={ogImageUrl} />
      </Head>

      <VersionContextProvider value={{ major, minor, file, versions, tags }}>
        <SidebarContextProvider>
          <Header />
          <div className='flex'>
            <Sidebar sidebar={sidebar} file={file} loading={loading} />
            <DocsContainer html={html} loading={loading} />
          </div>
          <BackToTop />
          {!loading && <Footer dark darkClassName='bg-dark-gray-975' showToggles={false} outline />}
        </SidebarContextProvider>
      </VersionContextProvider>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  let paths: GetStaticPathsResult['paths'] = []
  for (let localeVal of locales || []) {
    const locale = getLocale(localeVal)

    const nextLocaleParam = locale !== Locale.English ? { locale } : {}

    const bedrockVersions = await allFilesList(locale)
    const tags = await getTags(locale)

    const stableVersionParts = getVersionParts(tags[Tags.Stable][1])

    const [ , stableMajor, stableMinor ] = stableVersionParts

    for (let [ major, minor, files ] of bedrockVersionsInOrder(bedrockVersions)) {
      for (let file of files) {
        file = encodeURI(file)
        const version = [ major, minor ]

        const versionParts = getVersionParts(minor)

        const [ , verMajor, verMinor ] = versionParts

        let shouldPreload = false
        if (verMajor >= stableMajor) {
          if (verMajor === stableMajor) {
            // generate if the minor is more than that of the stable
            shouldPreload = verMinor >= stableMinor
          } else {
            // generate if of a greater version than stable (ex. 1.17 and stable is 1.16)
            shouldPreload = true
          }
        }

        // handle stable and beta routes
        if (areVersionsEqual(version, tags[Tags.Stable])) {
          paths.push({ params: {slug: ['stable', file]}, ...nextLocaleParam })
          shouldPreload = true
        } else if (areVersionsEqual(version, tags[Tags.Beta])) {
          paths.push({ params: {slug: ['beta', file]}, ...nextLocaleParam })
          shouldPreload = true
        }

        if (shouldPreload) {
          paths.push({ params: {slug: [major, minor, file]}, ...nextLocaleParam })
        }
      }
    }
  }

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params, locale: localeVal }) => {
  const locale = getLocale(localeVal)

  let html: string | null = null
  let displayHtml: string | null = null
  let parsedData: ParseHtmlResponse | null = null

  if (!params) return { notFound: true }

  const { slug } = params
  let version: string[] = []

  // transform to "compressed" version
  const bedrockVersions = transformOutbound(await allFilesList(locale))
  const tags = await getTags(locale)

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

    const htmlData = await fetchHtml(version, locale)
    if (!htmlData) return { notFound: true }

    ;({ html, displayHtml } = htmlData)

    Log.info(`Processing ${logLinkColor(path)}...`)
    parsedData = extractDataFromHtml(html, file)
    Log.info('Done processing ' + logLinkColor(path))
  }

  return {
    props: { html: displayHtml, bedrockVersions, tags, parsedData, version, ...await serverSideTranslations(locale, ['common']), },
    // revalidate: 60 * 60 * 12, // every 12 hours
  }
}

export default Docs
