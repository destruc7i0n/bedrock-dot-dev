import React, { useContext } from 'react'

import { SidebarContext, setOpen } from './sidebar-context'

const SidebarMask = () => {
  const { dispatch } = useContext(SidebarContext)

  return (
    <div>
      <div className='sidebar-mask' onClick={() => dispatch(setOpen(false))} />
      <style jsx>{`
        .sidebar-mask {
          position: fixed;
          background-color: rgba(0, 0, 0, 0.3);
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 8;
        }
      `}</style>
    </div>
  )
}

export default SidebarMask
