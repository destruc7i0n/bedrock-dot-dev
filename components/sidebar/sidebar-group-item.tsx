import React, { FunctionComponent, memo } from 'react'

import cn from 'classnames'

import { removeHashIfNeeded } from 'lib/util'

type Props = {
  title: string
  id: string
  hash: string
  onClick: () => void
}

const SidebarGroupItem: FunctionComponent<Props> = ({ title, id, hash, onClick }) => {
  const active = removeHashIfNeeded(hash) === id

  return (
    <li className='my-1'>
      <a
        className={cn(
          'sidebar-id block text-sm w-full px-2 rounded-md py-1',
          { 'text-blue-600 dark:text-blue-500 bg-gray-100 dark:bg-dark-gray-900': active, 'text-gray-800 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-dark-gray-900': !active },
          'transition-all duration-150 ease-in-out',
        )}
        href={`#${encodeURIComponent(id)}`}
        onClick={onClick}
      >
        {title}
      </a>
    </li>
  )
}

export default memo(SidebarGroupItem)
