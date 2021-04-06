import React, { useRef, useEffect, FunctionComponent } from 'react'

import { useTranslation } from 'next-i18next'

import classNames from 'classnames'
import { useIsMobile } from 'hooks/media-query'

type Props = {
  captureForwardSlash?: boolean
  className?: string
  placeHolder?: string
  staticPosition: boolean
}

const DocSearch: FunctionComponent<Props> = ({ captureForwardSlash = true, className, placeHolder, staticPosition, }) => {
  const { t } = useTranslation('common')
  if (!placeHolder) placeHolder = t('component.search.title')

  const input = useRef<HTMLInputElement | null>(null)
  const isMobile = useIsMobile()

  const triggerElement = () => {
    input.current?.focus()
  }

  useEffect(() => {
    const inputs = ['input', 'select', 'button', 'textarea']

    const down = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        !inputs.includes(document.activeElement!.tagName.toLowerCase())
      ) {
        if (e.key === '/') {
          e.preventDefault()
          triggerElement()
        }
      }
    }

    if (captureForwardSlash) {
      window.addEventListener('keydown', down)
      return () => window.removeEventListener('keydown', down)
    }
  }, [ captureForwardSlash ])

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined') {
      import('docsearch.js').then(({ default: docsearch }) => {
        docsearch({
          apiKey: '6276b927975d54b2c2b16337054f38fb',
          indexName: 'bedrock',
          inputSelector: 'input#algolia-doc-search',
          transformData (hits: { url: string }[]) {
            // handle development environment
            hits.forEach(hit => {
              // make relative
              const a = document.createElement('a')
              a.href = hit.url
              hit.url = `${a.pathname}${a.hash}`
            })
            return hits
          },
          debug: false,
        })
      })
    }
  }, [])

  return (
    <div className={classNames('w-full flex items-center docs-search', { 'docs-static': staticPosition, })}>
      <label className='block text-sm font-bold mb-1 sr-only' htmlFor='algolia-doc-search'>{t('component.search.title')}</label>
      <input
        id='algolia-doc-search'
        className={className}
        type='search'
        placeholder={`${placeHolder}${!isMobile && captureForwardSlash ? ` ${t('component.search.focus_key')}` : ''}`}
        ref={input}
      />
    </div>
  )
}

export default DocSearch
