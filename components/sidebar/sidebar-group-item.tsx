import React, { FunctionComponent, memo } from 'react'

import cn from 'classnames'

import { removeHashIfNeeded } from 'lib/util'

type Props = {
  title: string
  id: string
  hash: string
}

const SidebarGroupItem: FunctionComponent<Props> = ({ title, id, hash }) => {
  const active = removeHashIfNeeded(hash) === id

  return (
    <li className='my-2'>
      <a className={cn('sidebar-id block text-sm w-full px-2', { 'text-blue-600 hover:text-blue-500': active, 'hover:opacity-75 transition-opacity duration-75 ease-in-out': !active })} href={`#${id}`}>
        {title}
      </a>
    </li>
  )
}

export default memo(SidebarGroupItem)
