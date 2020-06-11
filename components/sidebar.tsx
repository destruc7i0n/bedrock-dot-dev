import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'

import { unstable_batchedUpdates } from 'react-dom'

import cn from 'classnames'

import Selectors from './sidebar/sidebar-selectors'
import { SidebarContext } from './sidebar/sidebar-context'
import SidebarMask from './sidebar/sidebar-mask'
import VersionContext from './version-context'
import { useIsMobile } from './media-query'
import SidebarContent from './sidebar/sidebar-content'
import SidebarFilter from './sidebar/sidebar-filter'

export interface SidebarStructureElement {
  title: string
  id: string
}

export interface SidebarStructure {
  [key: string]: SidebarStructureElement[]
}

type Props = {
  sidebar: SidebarStructure,
  file: string
  loading: boolean
}

const Sidebar: FunctionComponent<Props> = ({ sidebar, file, loading }) => {
  if (!sidebar) return null

  const [filter, setFilter] = useState('')
  const [hash, setHash] = useState('')
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  const mobile = useIsMobile()

  const { open } = useContext(SidebarContext)
  const versionContext = useContext(VersionContext)

  // reset when the page changes
  useEffect(() => {
    unstable_batchedUpdates(() => {
      setFilter('')
      setHash('')
    })
  }, [ file ])

  useEffect(() => {
    // disable scrolling when in sidebar
    if (mobile) document.body.style.overflow = open ? 'hidden' : 'initial'
  }, [ open ])

  useEffect(() => {
    // automatically scroll to the hash in the sidebar on page load
    if (location.hash) {
      const hash = decodeURIComponent(location.hash)
      setHash(hash)
      const el: HTMLAnchorElement | null = document.querySelector(
        `.sidebar .sidebar-id[href="${hash}"]`
      )
      if (el) {
        if (sidebarRef.current) {
          sidebarRef.current.scrollTop = el.offsetTop - 164
        }
      }
    }

    // store the hash for re-render
    const onHashChange = () => setHash(decodeURIComponent(location.hash))

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const loadingContent = (
    <div className='flex-1 flex px-4 py-4'>
      <div className='w-full'>
        <div className='w-4/5 bg-gray-100 h-8' />
        <div className='w-2/3 bg-gray-100 h-3 mt-4' />
        <div className='w-5/6 bg-gray-100 h-3 mt-4' />
        <div className='w-1/2 bg-gray-100 h-3 mt-4' />

        <div className='w-3/5 bg-gray-100 h-8 mt-10' />
        <div className='w-2/4 bg-gray-100 h-s mt-4' />
        <div className='w-2/3 bg-gray-100 h-3 mt-4' />
        <div className='w-3/4 bg-gray-100 h-3 mt-4' />
        <div className='w-2/3 bg-gray-100 h-3 mt-4' />
        <div className='w-3/5 bg-gray-100 h-3 mt-4' />
      </div>
    </div>
  )

  const loadingSelectors = (
    <div className='w-full'>
      <div className='flex flex-row'>
        <div className='w-2/4 bg-gray-100 h-8' />
        <div className='w-2/4 bg-gray-100 h-8 ml-2' />
      </div>
      <div className='w-4/5 bg-gray-100 h-8 mt-4' />
    </div>
  )

  return (
    <>
      { open && mobile && <SidebarMask /> }
      <aside className={cn('sidebar', { open })}>
        <div className='w-full p-4 border-b border-gray-200'>
          {!!Object.keys(sidebar).length ? (
            <>
              <Selectors/>
              <SidebarFilter setValue={setFilter} value={filter} />
            </>
          ) : loadingSelectors}
        </div>
        { loading ? loadingContent : (
          <>
            <div className='flex-1 flex flex-col overflow-scroll scrolling-touch pb-48 md:pb-8 h-0' ref={sidebarRef}>
              <SidebarContent search={filter} sidebar={sidebar} file={file} hash={hash}  />
            </div>
            <div className='hidden lg:block bg-white w-full px-4 py-2 border-t border-gray-200 bottom-safe-area-inset inset-2'>
              <a className='text-sm text-gray-500 hover:text-gray-400 font-normal float-right'
                 target='_blank'
                 rel='noopener noreferrer'
                 href={`https://github.com/bedrock-dot-dev/docs/blob/master/${versionContext.major}/${versionContext.minor}/${versionContext.file}.html`}
              >
                View on GitHub
              </a>
            </div>
          </>
        ) }
      </aside>
    </>
  )
}

export default Sidebar
