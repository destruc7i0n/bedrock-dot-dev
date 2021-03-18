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

const DownArrow = (
  <svg viewBox='0 0 24 24' width='16' height='16' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' fill='none' shapeRendering='geometricPrecision'>
    <path d='M15 18l-6-6 6-6' />
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
    <div>
      <div className={cn(
        'flex flex-row py-2 px-4 text-gray-800 dark:text-gray-300 bg-white dark:bg-dark-gray-950 cursor-pointer',
        { 'sticky top-0': isOpen && hasChildren, 'select-none': hasChildren },
        'border-b border-gray-200 dark:border-dark-gray-800'
      )} onClick={handleClick}>
        <a className={cn(
          'font-bold',
          { 'text-blue-600 hover:text-blue-500 dark:text-blue-500 dark-hover:text-blue-400': active,
            'hover:text-gray-900 dark-hover:text-gray-200': !active },
          'transition-all duration-75 ease-in-out'
        )} href={`#${encodeURIComponent(id)}`}>{title}</a>
        {hasChildren && (
          <div className={cn(
            'flex ml-auto items-center cursor-pointer select-none transform transition duration-150 ease-in-out',
            { '-rotate-90': isOpen }
          )}>
            {DownArrow}
          </div>
        )}
      </div>
      <ul className={cn('nav px-4', { 'border-b border-gray-200 dark:border-dark-gray-800': isOpen && hasChildren })}>
        {isOpen && children}
      </ul>
    </div>
  )
}

export default SidebarGroupTitle
