import React, { useEffect } from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Error from 'next/error'

import cn from 'classnames'

import { BedrockVersions } from '../api/docs/list'

import { parseHtml, ParseHtmlResponse, removeDisplayHtml } from '../../lib/html'

import Layout from '../../components/layout'
import Sidebar  from '../../components/sidebar'
import LocationContext from '../../components/location-context'
import Loading from '../../components/loading'
import { useIsMobile } from '../../components/media-query'
import { useScrollController } from '../../components/scroll-controller'

import { getBedrockVersions } from '../../lib/files'
import { getDocsFilesFromRepo } from '../../lib/github/raw'

type Props = {
  html: string
  bedrockVersions: BedrockVersions,
  parsedData: ParseHtmlResponse
}

const Docs = ({ html, bedrockVersions, parsedData }: Props) => {
  const { isFallback, query } = useRouter()
  const { slug: [ major, minor, file ] } = query

  const isMobile = useIsMobile()

  useScrollController()

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  const showSidebar = !isMobile

  // while loading...
  if (!html || !parsedData || !bedrockVersions) {
    if (isFallback) {
      return (
        <Layout title={'Loading...'} versions={bedrockVersions}>
          <Loading />
        </Layout>
      )
    } else {
      return <Error statusCode={404} />
    }
  }

  return (
    <LocationContext.Provider value={{ major, minor, file }}>
      <Layout title={parsedData && parsedData.title} versions={bedrockVersions}>
        <div className='mb-3 row'>
          {showSidebar && (
            <div className='col-3'>
              <Sidebar sidebar={parsedData && parsedData.sidebar}/>
            </div>
          )}
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className={cn({'col-9': showSidebar, 'col-12': !showSidebar}, 'docs-container')}
          />
        </div>
      </Layout>
    </LocationContext.Provider>
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
    parsedData = parseHtml(html)
  }

  return { props: { html: displayHtml, bedrockVersions, parsedData } }
}

export default Docs
