import React, { FunctionComponent, useContext, useEffect } from 'react'

import cn from 'classnames'

import { SidebarContext } from './sidebar/sidebar-context'

import { handleScroll } from 'lib/scroller'
import { useIsMobile } from './media-query'

type Props = {
  html: string
  sidebarIds: string[]
  loading: boolean
}

const DocsContainer: FunctionComponent<Props> = ({ html, sidebarIds, loading }) => {
  const { state: { open } } = useContext(SidebarContext)

  const mobile = useIsMobile()

  const handler = () => handleScroll(sidebarIds)
  useEffect(() => {
    if (!mobile) {
      window.addEventListener('scroll', handler)
    }
    return () => window.removeEventListener('scroll', handler)
  }, [ sidebarIds, mobile ])

  if (loading) {
    return (
      <div className={cn('docs-container my-8', { open })}>
        <div className='w-4/5 bg-gray-100 h-8' />
        <div className='w-2/3 bg-gray-100 h-3 mt-10' />
        <div className='w-5/6 bg-gray-100 h-3 mt-4' />
        <div className='w-4/5 bg-gray-100 h-3 mt-4' />
        <div className='w-3/4 bg-gray-100 h-s mt-4' />
        <div className='w-2/3 bg-gray-100 h-3 mt-4' />
        <div className='w-2/4 bg-gray-100 h-3 mt-4' />

        <div className='w-2/3 bg-gray-100 h-3 mt-10' />
        <div className='w-4/5 bg-gray-100 h-3 mt-4' />
        <div className='w-5/6 bg-gray-100 h-3 mt-4' />
        <div className='w-3/4 bg-gray-100 h-3 mt-4' />
        <div className='w-3/4 bg-gray-100 h-3 mt-4' />
        <div className='w-2/3 bg-gray-100 h-3 mt-4' />

        <div className='w-3/4 bg-gray-100 h-3 mt-10' />
        <div className='w-4/5 bg-gray-100 h-3 mt-4' />
        <div className='w-2/3 bg-gray-100 h-3 mt-4' />
        <div className='w-5/6 bg-gray-100 h-3 mt-4' />
        <div className='w-3/4 bg-gray-100 h-3 mt-4' />
        <div className='w-2/3 bg-gray-100 h-3 mt-4' />
      </div>
    )
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={cn('docs-container', { open })}
    />
  )
}

export default DocsContainer
