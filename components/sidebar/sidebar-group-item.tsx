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
    <li>
      <a className={cn('sidebar-item', { active })} href={id}>
        {title}
      </a>
      <style jsx>{`
        li {
          width: 100%;
        }

        a {
          color: #313131;
          display: block;
          padding: .25rem .5rem;
          font-size: 90%;
          width: 100%;
        }
      `}</style>
    </li>
  )
}

export default SidebarGroupItem
