import React, { FunctionComponent, useContext, useEffect, useState } from 'react'

import cn from 'classnames'

import Selectors from './selectors'
import SidebarGroupTitle from './sidebar/sidebar-group-title'
import SidebarGroupItem from './sidebar/sidebar-group-item'
import { SidebarContext, setOpen } from './sidebar/sidebar-context'
import SidebarMask from './sidebar/sidebar-mask'
import { getMediaQuery, useIsMobile } from './media-query'

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

  const isShown = open

  return (
    <>
      <div className={cn('sidebar-container', { loaded })}>
        { isShown && mobile && <SidebarMask /> }
        <div className={cn('sidebar', { open: isShown })}>
          <div className='sidebar-content'>
            <Selectors />
            {Object.keys(sidebar).map((header, index) => {
              return (
                <SidebarGroupTitle key={`${file}-title-${index}`} title={header} id={`#${header}`}>
                  {sidebar[header].map((title) =>
                    <SidebarGroupItem key={`${file}-item-${title.id}`} id={title.id} title={title.title} />
                  )}
                </SidebarGroupTitle>
              )
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
      .sidebar {
        width: var(--sidebar-width);
        position: fixed;
        top: 4rem;
        z-index: 9;
        height: calc(100vh - 4rem);
        overflow: auto;
        margin-left: -15px;
        background-color: #949494;
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
      }
      
      @media (max-width: 768px) {
        .sidebar {
          width: 80%;
          transition: transform 0.5s cubic-bezier(0.5, 0.32, 0.01, 1);
        }
        
        .sidebar-container:not(.loaded) {
          display: none;
        }
      }
      
      .sidebar-content {
        display: flex;
        flex-direction: column;
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      @supports(padding: max(0px)) {
        .sidebar-content {
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
    `}</style>
    </>
  )
}

export default Sidebar
