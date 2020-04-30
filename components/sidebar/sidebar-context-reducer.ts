import { ContextType as SidebarContextType } from './sidebar-context'

export enum Types {
  SetOpen = 'SET_OPEN',
}

export type Actions =
  | { type: Types.SetOpen, payload: boolean }

export const sidebarReducer = (state: SidebarContextType, action: Actions) => {
  switch (action.type) {
    case Types.SetOpen: {
      return {
        ...state,
        open: action.payload
      }
    }
    default: return state
  }
}

// actions

export const setOpen = (value: boolean) => ({ type: Types.SetOpen, payload: value })
