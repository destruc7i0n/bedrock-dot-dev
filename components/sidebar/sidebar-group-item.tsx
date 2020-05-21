import React, { FunctionComponent, memo } from 'react'

import cn from 'classnames'

import { addHashIfNeeded } from 'lib/util'

type Props = {
  title: string
  id: string
  active: boolean
}

const SidebarGroupItem: FunctionComponent<Props> = ({ title, id, active }) => {
  id = addHashIfNeeded(id)
  return (
    <li className='my-2'>
      <a className={cn('sidebar-id block text-sm w-full px-2', { 'text-blue-600 hover:text-blue-500': active, 'text-black hover:text-gray-600': !active })} href={id}>
        {title}
      </a>
    </li>
  )
}

export default memo(SidebarGroupItem)
