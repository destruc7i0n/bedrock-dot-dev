import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'

import cn from 'classnames'

import Selectors from './selectors'
import SidebarGroupTitle from './sidebar/sidebar-group-title'
import SidebarGroupItem from './sidebar/sidebar-group-item'
import { SidebarContext, setOpen } from './sidebar/sidebar-context'
import SidebarMask from './sidebar/sidebar-mask'
import { getMediaQuery, useIsMobile } from './media-query'
import { removeHashIfNeeded } from '../lib/util';

export interface SidebarStructure {
  [key: string]: {
    title: string
    id: string
  }[]
}

type Props = {
  sidebar: SidebarStructure,
  file: string
}

const Sidebar: FunctionComponent<Props> = ({ sidebar, file }) => {
  if (!sidebar) return null

  const [hash, setHash] = useState('')
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  const mobile = useIsMobile()

  const { state: { open }, dispatch } = useContext(SidebarContext)

  // this is meant to stop the animation on load of the sidebar
  // as it will show for a split second until the media query updates
  const [ loaded, setLoaded ] = useState(false)

  useEffect(() => {
    // disable scrolling when in sidebar
    if (mobile) document.body.style.overflow = open ? 'hidden' : 'initial'
  }, [ open ])

  useEffect(() => {
    let updatedOpen = open

    if (!mobile && !open) updatedOpen = true
    if (mobile && open) updatedOpen = false

    if (updatedOpen !== open) {
      dispatch(setOpen(updatedOpen))
      // when there is a view change, allow it to happen
      if (!loaded) setLoaded(true)
    }
  }, [ mobile ])

  useEffect(() => {
    // theres no need to prevent the animation on desktop
    if (!getMediaQuery(768).matches) {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    setHash(decodeURIComponent(location.hash))
    const onHashChange = () => {
      if (location.hash && !mobile) {
        const hash = decodeURIComponent(location.hash)
        setHash(hash)
        const el: HTMLAnchorElement | null = document.querySelector(
          `.sidebar .sidebar-item[href="${hash}"]`
        )
        if (el) {
          if (sidebarRef.current) {
            sidebarRef.current.scrollTop = el.offsetTop - 64
          }
        }
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [ mobile ])

  const isShown = open
  const isActive = (id: string) => removeHashIfNeeded(id) === removeHashIfNeeded(hash)

  return (
    <>
      <div className={cn('sidebar-container', { loaded })}>
        { isShown && mobile && <SidebarMask /> }
        <div className={cn('sidebar', { open: isShown })} ref={sidebarRef}>
          <div className='w-full px-4 py-4 border-b border-gray-200'>
            <Selectors />
          </div>
          <div className='flex-1 flex flex-col overflow-auto pb-8 h-0'>
            <div className='flex-1'>
              {Object.keys(sidebar).map((header, index) => {
                return (
                  <SidebarGroupTitle key={`${file}-title-${index}`} title={header} id={`#${header}`} active={isActive(header)}>
                    {sidebar[header].map((item) =>
                      <SidebarGroupItem key={`${file}-item-${removeHashIfNeeded(item.id)}`} id={item.id} title={item.title} active={isActive(item.id)} />
                    )}
                  </SidebarGroupTitle>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
