import React, { createContext, Dispatch, useEffect, useReducer, useState } from 'react'

import { unstable_batchedUpdates } from 'react-dom'

import { sidebarReducer, Actions, setOpen } from './sidebar-context-reducer'
import { isLg } from '../media-query'

export type ContextType = {
  open: boolean
}

let initialState: ContextType = { open: true }

export const SidebarContext = createContext<{
  state: ContextType
  dispatch: Dispatch<Actions>
  loaded: boolean
}>({
  state: initialState,
  dispatch: () => null,
  loaded: false,
})

export const SidebarContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(sidebarReducer, initialState)
  const [loaded, setLoaded] = useState(false)

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

    unstable_batchedUpdates(() => {
      dispatch(setOpen(open))
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar', JSON.stringify(state))
  }, [ state ])

  return (
    <SidebarContext.Provider value={{state, dispatch, loaded}}>
      {children}
    </SidebarContext.Provider>
  )
}

export { setOpen }
