import React, { FunctionComponent, useContext, useEffect } from 'react'

import cn from 'classnames'

import Selectors from './selectors'
import SidebarGroupTitle from './sidebar/sidebar-group-title'
import SidebarGroupItem from './sidebar/sidebar-group-item'
import { setOpen, SidebarContext } from './sidebar/sidebar-context';
import SidebarMask from './sidebar/sidebar-mask';

export interface SidebarStructure {
  [key: string]: {
    title: string
    id: string
  }[]
}

type Props = {
  sidebar: SidebarStructure
  mobile: boolean
}

const Sidebar: FunctionComponent<Props> = ({ sidebar, mobile })  => {
  if (!sidebar) return null

  const { state: { open }, dispatch } = useContext(SidebarContext)

  useEffect(() => {
    if (!mobile && !open) dispatch(setOpen(true))
    if (mobile && open) dispatch(setOpen(false))
  }, [ mobile ])

  useEffect(() => {
    if (mobile) document.body.style.overflow = open ? 'hidden' : 'initial'
  }, [ mobile, open ])

  return (
    <div>
      { open && mobile && <SidebarMask /> }
      <div className={cn('sidebar', { open })}>
        <div className='sidebar-container'>
          <Selectors />
          {Object.keys(sidebar).map((header, index) => {
            return (
              <SidebarGroupTitle key={index} title={header} id={`#${header}`}>
                {sidebar[header].map((title) =>
                  <SidebarGroupItem key={title.id} id={title.id} title={title.title} />
                )}
              </SidebarGroupTitle>
            )
          })}
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
        }
        
        .sidebar-container {
          display: flex;
          flex-direction: column;
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        @supports(padding: max(0px)) {
          .sidebar-container {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
      </div>
    </div>
  )
}

export default Sidebar
