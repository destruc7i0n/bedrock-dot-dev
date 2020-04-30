import React, { createContext, Dispatch, useReducer } from 'react'

import { sidebarReducer, Actions, setOpen } from './sidebar-context-reducer'

export type ContextType = {
  open: boolean
}

let initialState: ContextType = { open: true }

export const SidebarContext = createContext<{
  state: ContextType
  dispatch: Dispatch<Actions>
}>({
  state: initialState,
  dispatch: () => null
})

export const SidebarContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(sidebarReducer, initialState)

  return (
    <SidebarContext.Provider value={{state, dispatch}}>
      {children}
    </SidebarContext.Provider>
  )
}

export { setOpen }
