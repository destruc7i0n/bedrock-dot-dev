import React, { FunctionComponent, memo, useEffect, useRef, useState } from 'react'

import { SidebarStructure } from '../sidebar'
import SidebarGroupTitle from './sidebar-group-title'
import SidebarGroupItem from './sidebar-group-item'

type Props = {
  sidebar: SidebarStructure
  file: string
  search?: string
}

type SidebarContentState = {
  [key: string]: boolean
}

// initially open or closed state for the sidebar
const getInitialOpen = (sidebar: SidebarStructure, file: string) => {
  let state: SidebarContentState = {}
  for (let heading of Object.keys(sidebar)) {
    state[heading] = file !== 'Entities'
  }
  return state
}

const SidebarContent: FunctionComponent<Props> = ({ sidebar, file, search }) => {
  const [mounted, setMounted] = useState(false)
  const [hash, setHash] = useState('')
  const [open, setOpen] = useState<SidebarContentState>(getInitialOpen(sidebar, file))
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  // reset hash on page change
  useEffect(() => {
    setHash('')
  }, [ file ])

  // open on page load if the heading is closed for the item in the hash
  useEffect(() => {
    if (location.hash) {
      const hash = decodeURIComponent(location.hash)
      setHash(hash)
      // if there is a hash open the heading which contains the hash on load
      const heading = Object.keys(sidebar)
        .find((h) =>
          sidebar[h].find((el) => el.id === hash.substring(1))
        )
      if (heading && !open[heading]) setHeadingOpen(heading, true)
    }
    setMounted(true)

    // store the hash for re-render
    const onHashChange = () => setHash(decodeURIComponent(location.hash))

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // run after mount to scroll to the hash
  // since the group might be closed
  useEffect(() => {
    // automatically scroll to the hash in the sidebar on page load
    if (hash) {
      const el: HTMLAnchorElement | null = document.querySelector(
        `.sidebar .sidebar-id[href="${hash}"]`
      )
      if (el) {
        if (sidebarRef.current) {
          sidebarRef.current.scrollTop = el.offsetTop - 164
        }
      }
    }
  }, [ mounted ])

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

  // helper method to update the state
  const setHeadingOpen = (heading: string, value: boolean) => {
    if (open[heading] === value) return // don't update if already value
    setOpen({
      ...open,
      [heading]: value
    })
  }

  return (
    <div className='flex-1 flex flex-col overflow-y-auto pb-48 md:pb-8 h-0' ref={sidebarRef}>
      {Object.keys(sidebar).map((header, index) => {
        return (
          <SidebarGroupTitle
            searching={!!search}
            key={`${file}-title-${index}`}
            open={open[header]}
            setOpen={(open) => setHeadingOpen(header, open)}
            title={header}
            id={header}
            hash={hash}
          >
            {sidebar[header].map((item) =>
              <SidebarGroupItem
                key={`${file}-item-${item.id}`}
                id={item.id}
                title={item.title}
                hash={hash}
                // keep the header containing this one open on click (while searching)
                onClick={() => setHeadingOpen(header, true)}
              />
            )}
          </SidebarGroupTitle>
        )
      })}
    </div>
  )
}

export default memo(SidebarContent)
