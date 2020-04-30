import React, { FunctionComponent } from 'react'

import { scrollTo } from '../../lib/scroller'

type Props = {
  title: string
  id: string
}

const SidebarGroupItem: FunctionComponent<Props> = ({ title, id }) => {
  return (
    <li>
      <a href={id} onClick={(e) => scrollTo(e, id)}>
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
