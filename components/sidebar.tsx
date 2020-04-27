import React, { FunctionComponent } from 'react'
import SidebarGroupTitle from './sidebar/sidebar-group-title';
import SidebarGroupItem from './sidebar/sidebar-group-item';

export interface SidebarStructure {
  [key: string]: {
    title: string
    id: string
  }[]
}

type Props = {
  sidebar: SidebarStructure
}

const Sidebar: FunctionComponent<Props> = ({ sidebar })  => {
  if (!sidebar) return null

  return (
    <div className='sidebar'>
      <div className='my-1 d-flex flex-column'>
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
          position: sticky;
          top: 4rem;
          z-index: 1000;
          height: calc(100vh - 4rem);
          overflow: auto;
          margin-left: -15px;
          background-color: #949494;
        }
      `}</style>
    </div>
  )
}

export default Sidebar
