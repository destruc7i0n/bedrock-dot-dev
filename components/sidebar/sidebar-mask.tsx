import React, { FunctionComponent, memo, useContext } from 'react'

import { SidebarContext } from './sidebar-context'

const SidebarMask: FunctionComponent = () => {
  const { setOpen } = useContext(SidebarContext)

  return (
    <div className='sidebar-mask' onClick={() => setOpen(false)} />
  )
}

export default memo(SidebarMask)
