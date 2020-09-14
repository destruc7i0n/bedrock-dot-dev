import React, { useRef, useEffect, FunctionComponent } from 'react'

import classNames from 'classnames'

import { useIsMobile } from './media-query'

type Props = {
  captureForwardSlash?: boolean
  className?: string
  placeHolder?: string
  staticPosition: boolean
}

const DocSearch: FunctionComponent<Props> = ({ captureForwardSlash = true, className, placeHolder = 'Search', staticPosition, }) => {
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
    if (window.docsearch) {
      // @ts-ignore
      window.docsearch({
        apiKey: '6276b927975d54b2c2b16337054f38fb',
        indexName: 'bedrock',
        inputSelector: 'input#algolia-doc-search',
        debug: false,
      })
    }
    // @ts-ignore
  }, [ typeof window !== 'undefined' ? window.docsearch : false ])

  return (
    <div className={classNames('w-full flex items-center docs-search', { 'docs-static': staticPosition, })}>
      <label className='block text-sm font-bold mb-1 sr-only' htmlFor='algolia-doc-search'>Search</label>
      <input
        id='algolia-doc-search'
        className={className}
        type='search'
        placeholder={`${placeHolder}${!isMobile && captureForwardSlash ? ' ("/" to focus)' : ''}`}
        ref={input}
      />
    </div>
  )
}

export default DocSearch
