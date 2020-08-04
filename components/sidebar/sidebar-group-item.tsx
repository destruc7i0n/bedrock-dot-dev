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
    <li className='my-2'>
      <a
        className={cn(
          'sidebar-id block text-sm w-full px-2',
          { 'text-blue-600 hover:text-blue-500 dark:text-blue-500 dark-hover:text-blue-400 font-semibold': active, 'text-gray-800 hover:text-gray-900 dark:text-gray-300 dark-hover:text-gray-200': !active },
          'transition-all duration-150 ease-in-out',
        )}
        href={`#${id}`}
        onClick={onClick}
      >
        {title}
      </a>
    </li>
  )
}

export default memo(SidebarGroupItem)
