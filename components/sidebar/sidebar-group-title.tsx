import React, { Children, FunctionComponent, useState, MouseEvent } from 'react'

import cn from 'classnames'

import { addHashIfNeeded } from 'lib/util'

type Props = {
  title: string
  id: string
  active: boolean
}

const RightArrow = (
  <svg width='6' height='10' viewBox='0 0 6 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M1.4 8.56L4.67 5M1.4 1.23L4.66 4.7' stroke='#000' strokeLinecap='square' />
  </svg>
)

const SidebarGroupTitle: FunctionComponent<Props> = ({ title, id, children, active }) => {
  const [ open, setOpen ] = useState(true)

  const hasChildren = !!Children.count(children)

  id = addHashIfNeeded(id)

  const handleClick = (e: MouseEvent) => {
    // do not toggle open if this was a click on the link
    if ((e.nativeEvent.target as HTMLElement).nodeName === 'A') {
      return
    }
    setOpen(!open)
  }

  return (
    <div className='position-relative'>
      <div className={cn('flex flex-row py-2 px-4 bg-white cursor-pointer', { 'sticky top-0': open }, 'border-b border-gray-200')} onClick={handleClick}>
        <a className={cn({ 'font-extrabold text-blue-600 hover:text-blue-500': active, 'font-bold text-black hover:text-gray-600': !active })} href={id}>{title}</a>
        {hasChildren && (
          <div className={cn('sidebar-expand', { open })}>
            {RightArrow}
          </div>
        )}
      </div>
      <ul className={cn('nav px-4', { 'border-b border-gray-200': open && hasChildren })}>
        {open && children}
      </ul>
    </div>
  )
}

export default SidebarGroupTitle
