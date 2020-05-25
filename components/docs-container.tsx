import React, { FunctionComponent, memo, useContext } from 'react'

import cn from 'classnames'

import { SidebarContext } from './sidebar/sidebar-context'

type DocsContentProps = {
  html: string
  sidebarHidden: boolean
}

const DocsContent: FunctionComponent<DocsContentProps> = memo(({ html, sidebarHidden }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={cn('docs-container', { 'sidebar-hidden': sidebarHidden })}
    />
  )
})

type DocsContainerProps = {
  html: string
  loading: boolean
}

const DocsContainer: FunctionComponent<DocsContainerProps> = ({ html, loading }) => {
  const { state: { open }, loaded } = useContext(SidebarContext)

  const isSidebarHidden = !open && loaded

  if (loading) {
    return (
      <div className={cn('docs-container my-8', { 'sidebar-hidden': isSidebarHidden })}>
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

  return <DocsContent html={html} sidebarHidden={isSidebarHidden} />
}

export default DocsContainer
