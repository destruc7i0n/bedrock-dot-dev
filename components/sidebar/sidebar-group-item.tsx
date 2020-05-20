import React, { FunctionComponent } from 'react'

import cn from 'classnames'

import { addHashIfNeeded } from '../../lib/util'

type Props = {
  title: string
  id: string
  active?: boolean
}

const SidebarGroupItem: FunctionComponent<Props> = ({ title, id, active }) => {
  id = addHashIfNeeded(id)
  return (
    <li className='my-2'>
      <a className={cn('block text-sm w-full px-2 text-black hover:text-gray-800', { 'font-bold': active })} href={id}>
        {title}
      </a>
    </li>
  )
}

export default SidebarGroupItem
