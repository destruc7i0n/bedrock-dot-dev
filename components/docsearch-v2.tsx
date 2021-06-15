import { useState, useCallback, useRef, FunctionComponent } from 'react'
import { createPortal } from 'react-dom'

import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useTranslation } from 'next-i18next'

import cn from 'classnames'

import { DocSearchModal, DocSearchButton, useDocSearchKeyboardEvents } from '@docsearch/react'
import '@docsearch/css'

import { algolia } from './docsearch'

type Props = {
  placeHolder?: string,
  className?: string
}

const DocSearch: FunctionComponent<Props> = ({ placeHolder = '', className = '' }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const searchButtonRef = useRef<HTMLButtonElement | null>(null)
  const [initialQuery, setInitialQuery] = useState('')

  const { t } = useTranslation('common')
  if (!placeHolder) placeHolder = t('component.search.title')

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onInput = useCallback(
    (e) => {
      setIsOpen(true)
      setInitialQuery(e.key)
    },
    [setIsOpen, setInitialQuery]
  )

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  })

  return (
    <>
      <Head>
        <link rel='preconnect' href='https://BH4D9OD16A-dsn.algolia.net' crossOrigin='true' />
      </Head>
      <DocSearchButton
        className={cn('DocSearch DocSearch-Button', className)}
        ref={searchButtonRef}
        onClick={onOpen}
        translations={{
          buttonAriaLabel: placeHolder,
          buttonText: placeHolder,
        }}
      />
      {isOpen &&
        createPortal(
          <DocSearchModal
            initialQuery={initialQuery}
            initialScrollY={window.scrollY}
            onClose={onClose}
            {...algolia}
            navigator={{
              navigate({ itemUrl }) {
                setIsOpen(false)
                router.push(itemUrl)
              },
            }}
            hitComponent={({ hit, children }) => {
              return (
                <Link href={hit.url} scroll>
                  <a>{children}</a>
                </Link>
              )
            }}
            transformItems={(items) => {
              return items.map((item) => {
                const a = document.createElement('a')
                a.href = item.url

                return {
                  ...item,
                  url: `${a.pathname}${a.hash}`,
                }
              })
            }}
          />,
          document.body
        )}
    </>
  )
}

export default DocSearch
