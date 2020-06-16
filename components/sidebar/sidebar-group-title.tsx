import React, { Children, FunctionComponent, MouseEvent } from 'react'

import cn from 'classnames'

import { removeHashIfNeeded } from 'lib/util'

type Props = {
  title: string
  id: string
  hash: string
  open: boolean
  setOpen: (open: boolean) => void
  searching: boolean
}

const RightArrow = (
  <svg width='6' height='10' viewBox='0 0 6 10' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
    <path d='M1.4 8.56L4.67 5M1.4 1.23L4.66 4.7' stroke='#000' strokeLinecap='square' />
  </svg>
)

const SidebarGroupTitle: FunctionComponent<Props> = ({ title, id, children, hash, open, setOpen, searching }) => {
  const hasChildren = !!Children.count(children)

  const handleClick = (e: MouseEvent) => {
    // do not toggle open if this was a click on the link
    if ((e.nativeEvent.target as HTMLElement).nodeName === 'A') {
      return
    }
    setOpen(!open)
  }

  const active = removeHashIfNeeded(hash) === id
  const isOpen = open || searching

  return (
    <div className='position-relative'>
      <div className={cn('flex flex-row py-2 px-4 bg-white cursor-pointer', { 'sticky top-0': isOpen && hasChildren, 'select-none': hasChildren }, 'border-b border-gray-200')} onClick={handleClick}>
        <a className={cn({ 'font-extrabold text-blue-600 hover:text-blue-500': active, 'font-bold hover:text-gray-800': !active }, 'transition-all duration-75 ease-in-out')} href={`#${id}`}>{title}</a>
        {hasChildren && (
          <div className={cn('sidebar-expand', { open: isOpen })}>
            {RightArrow}
          </div>
        )}
      </div>
      <ul className={cn('nav px-4', { 'border-b border-gray-200': isOpen && hasChildren })}>
        {isOpen && children}
      </ul>
    </div>
  )
}

export default SidebarGroupTitle
