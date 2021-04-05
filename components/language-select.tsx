import React, { FunctionComponent, useEffect, useState } from 'react'

import { NextRouter, useRouter } from 'next/router'

import cn from 'classnames'

import { Locale } from '../lib/i18n'
import { TagsValues } from '../lib/tags'
import { BedrockVersionsFile } from '../lib/versions'

type Props = {
  className?: string
}

let docsManifest: BedrockVersionsFile | undefined

const checkRoute = async (router: NextRouter, nextLocale: string): Promise<boolean> => {
  const version = (router.query?.slug || []).slice(0, -1)

  // ignore paths that are not under the docs page
  if (!router.route.startsWith('/docs')) return true

  if (version.length === 1 && TagsValues.includes(version[0])) return true
  else if (version.length === 2) {
    // get the docs manifest
    if (!docsManifest) {
      console.log('Fetching docs manifest...')
      try {
        const response = await fetch('/static/docs.json')
        docsManifest = (await response.json()) as BedrockVersionsFile
      } catch (e) {
        console.error('Could not get docs manifest!')
      }
    }

    // check that the version has the locale
    const availableLocales = docsManifest?.byLocale?.[version[1]] ?? []
    return availableLocales.includes(nextLocale as Locale)
  }
  return false
}

const LanguageSelect: FunctionComponent<Props> = ({ className }) => {
  const router = useRouter()

  const [localeValue, setLocaleValue] = useState(router.locale ?? Locale.English)

  // check for the same file in the other language and redirect if available
  useEffect(() => {
    (async () => {
      if (localeValue !== router.locale) {
        const validPath = await checkRoute(router, localeValue)

        // if path not available, go home
        if (!validPath) {
          console.log(`Could not find path "${router.asPath}" in locale "${localeValue}"`)
          await router.push('/', '/', {locale: localeValue, scroll: false})
        }
        // otherwise navigate to same path in another langauge
        else await router.push({
          pathname: router.pathname,
          query: router.query,
          // hash: window.location.hash,
        }, undefined, { locale: localeValue, scroll: false })
      }
    })()
  }, [localeValue])

  return (
    <div className={cn('relative dark:text-gray-200', className)}>
      <label className='block text-sm font-bold mb-1 sr-only' htmlFor='locale'>Language Select</label>
      <select value={localeValue} onChange={({ target: { value } }) => setLocaleValue(value as Locale)} id='locale' className='leading-4 rounded border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-dark-gray-900 dark:border-dark-gray-800 text-sm py-2 pl-2 block'>
        <option value={Locale.English}>EN</option>
        <option value={Locale.Chinese}>中文</option>
      </select>
    </div>
  )
}

export default LanguageSelect
