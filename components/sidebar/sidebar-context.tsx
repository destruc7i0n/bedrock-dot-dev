import React, { createContext, useEffect, useState, FunctionComponent } from 'react'

import { isLg } from '../media-query'

type ContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const SidebarContext = createContext<ContextType>({
  open: true,
  setOpen: () => null
})

export const SidebarContextProvider: FunctionComponent = ({ children }) => {
  const [open, setOpen] = useState<boolean>(true)

  // rehyrate the open state from the localstorage
  useEffect(() => {
    // attempt to get from localstorage
    let open = true
    const localStorageItem = localStorage.getItem('sidebar')
    if (typeof localStorageItem === 'string') {
      ({ open } = JSON.parse(localStorageItem))
    }

    // not open if on small screen
    if (!isLg()) open = false

    setOpen(open)
    // remove the class from the preflight if it's there
    if (document.documentElement.classList.contains('sidebar-closed'))
      document.documentElement.classList.remove('sidebar-closed')
  }, [])

  // update localstorage on sidebar change
  useEffect(() => {
    // only update when on large screen
    if (isLg()) localStorage.setItem('sidebar', JSON.stringify({ open }))
  }, [ open ])

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}
