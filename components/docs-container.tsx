import React, { FunctionComponent, useContext } from 'react'
import { SidebarContext } from './sidebar/sidebar-context'

import cn from 'classnames'

type Props = {
  html: string
}

const DocsContainer: FunctionComponent<Props> = ({ html }) => {
  const { state: { open } } = useContext(SidebarContext)

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className={cn('docs-container', { open })}
      />
      <style jsx>{`
        @media (min-width: 768px) {
          .docs-container {
            padding-left: 0;
          }
          
          .docs-container.open {
            padding-left: var(--sidebar-width);
          }
        }
      `}</style>
    </div>
  )
}

export default DocsContainer
