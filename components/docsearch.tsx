import React, { useRef, useEffect } from 'react'

import { useIsMobile } from './media-query'

const DocSearch = () => {
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

    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

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
  }, [ ])

  return (
    <div className='w-full flex items-center docs-search'>
      <input
        id='algolia-doc-search'
        className='appearance-none border rounded py-1 px-3 text-gray-700 dark:text-gray-200 dark:bg-dark-gray-900 dark:border-dark-gray-800 leading-tight focus:outline-none focus:shadow-outline md:w-48 w-full md:mr-2 lg:mr-0'
        type='search'
        placeholder={`Search${!isMobile ? ' ("/" to focus)' : ''}`}
        ref={input}
      />
    </div>
  )
}

export default DocSearch
