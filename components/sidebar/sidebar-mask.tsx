import React, { FunctionComponent, useContext } from 'react'

import { SidebarContext, setOpen } from './sidebar-context'

const SidebarMask: FunctionComponent = () => {
  const { dispatch } = useContext(SidebarContext)

  return (
    <div>
      <div className='sidebar-mask' onClick={() => dispatch(setOpen(false))} />
      <style jsx>{`
        .sidebar-mask {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 8;
        }
        
        @media (max-width: 768px) {
          .sidebar-mask {
            background-color: rgba(0, 0, 0, 0.3) !important;
          }
        }
      `}</style>
    </div>
  )
}

export default SidebarMask
