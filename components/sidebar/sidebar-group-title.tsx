import React, { Children, FunctionComponent, useState } from 'react'

import cn from 'classnames'

import { scrollTo } from '../../lib/scroller'

type Props = {
  title: string
  id: string
}

const RightArrow = (
  <svg width='6' height='10' viewBox='0 0 6 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M1.4 8.56L4.67 5M1.4 1.23L4.66 4.7' stroke='#000' strokeLinecap='square' />
  </svg>
)

const SidebarGroupTitle: FunctionComponent<Props> = ({ title, id, children }) => {
  const [ open, setOpen ] = useState(true)

  const hasChildren = !!Children.count(children)

  return (
    <div>
      <div className='sidebar-title-container'>
        <a href={id} className='sidebar-title' onClick={(e) => scrollTo(e, id)}>{title}</a>
        {hasChildren && <div className={cn('sidebar-expand', {open})} onClick={() => setOpen(!open)}>
          {RightArrow}
        </div>}
      </div>
      <ul className='nav'>
        {open && children}
      </ul>
      <style jsx>{`
        .sidebar-title-container {
          display: flex;
          flex-direction: row;
          padding-top: .25rem;
        }

        .sidebar-title {
          display: block;
          padding-left: 1rem;
          font-weight: 600;
          color: #000;
        }
        
        .sidebar-expand {
          user-select: none;
          margin-left: auto;
          display: block;
          padding-right: 1rem;
          width: 20px;
          text-align: right;
          cursor: pointer;
        }
        
        .sidebar-expand:not(.open) > :global(svg) {
          transform: rotate(180deg);
        }
        
        .sidebar-expand.open > :global(svg) {
          transform: rotate(90deg);
        }
      `}</style>
    </div>
  )
}

export default SidebarGroupTitle
