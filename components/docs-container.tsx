import React, { FunctionComponent, useContext, useEffect } from 'react'

import cn from 'classnames'

import { SidebarContext } from './sidebar/sidebar-context'

import { handleScroll } from '../lib/scroller'
import { useIsMobile } from './media-query';

type Props = {
  html: string
  sidebarIds: string[]
}

const DocsContainer: FunctionComponent<Props> = ({ html, sidebarIds }) => {
  const { state: { open } } = useContext(SidebarContext)

  const mobile = useIsMobile()

  const handler = () => handleScroll(sidebarIds)
  useEffect(() => {
    if (!mobile) {
      window.addEventListener('scroll', handler)
    }
    return () => window.removeEventListener('scroll', handler)
  }, [ sidebarIds, mobile ])

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={cn('docs-container', { open })}
    />
  )
}

export default DocsContainer
