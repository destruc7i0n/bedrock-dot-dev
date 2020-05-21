import React, { FunctionComponent, memo, useContext } from 'react'

import { SidebarContext, setOpen } from './sidebar-context'

const SidebarMask: FunctionComponent = () => {
  const { dispatch } = useContext(SidebarContext)

  return (
    <div>
      <div className='sidebar-mask' onClick={() => dispatch(setOpen(false))} />
    </div>
  )
}

export default memo(SidebarMask)
