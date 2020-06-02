import React, { FunctionComponent, memo } from 'react'

import { SidebarStructure } from '../sidebar'
import SidebarGroupTitle from './sidebar-group-title'
import SidebarGroupItem from './sidebar-group-item'
import { removeHashIfNeeded } from '../../lib/util'

type Props = {
  sidebar: SidebarStructure
  file: string
  hash: string
  search?: string
}

const SidebarContent: FunctionComponent<Props> = ({ sidebar, file, hash, search }) => {
  // function to check if an id is active
  const isActive = (id: string) => removeHashIfNeeded(id) === removeHashIfNeeded(hash)

  // filter if filtering
  if (search) {
    let filteredSidebar: SidebarStructure = {}

    search = search.toLowerCase()

    const keys = Object.keys(sidebar)
    for (let key of keys) {
      // check if the key includes the search term by chance
      if (key.toLowerCase().includes(search)) {
        if (!filteredSidebar[key]) filteredSidebar[key] = []
      }

      for (let id of sidebar[key]) {
        if (id.title.toLowerCase().includes(search) || id.id.includes(search)) {
          if (!filteredSidebar[key]) filteredSidebar[key] = []

          filteredSidebar[key].push(id)
        }
      }
    }

    sidebar = filteredSidebar
  }

  return (
    <>
      {Object.keys(sidebar).map((header, index) => {
        return (
          <SidebarGroupTitle key={`${file}-title-${index}`} title={header} id={header} active={isActive(header)}>
            {sidebar[header].map((item) =>
              <SidebarGroupItem key={`${file}-item-${item.id}`} id={item.id} title={item.title} active={isActive(item.id)} />
            )}
          </SidebarGroupTitle>
        )
      })}
    </>
  )
}

export default memo(SidebarContent)
