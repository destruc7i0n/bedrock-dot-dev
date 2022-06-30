import React, { useContext, FunctionComponent, memo } from 'react'

import { getDocAlerts } from 'lib/docs-alerts'

import VersionContext from '../version-context'

import DocsAlert from './docs-alert'

type DocsContentProps = {
  html: string
}

const docsContentClass = 'docs-content text-gray-900 dark:text-gray-200'

const DocsContent: FunctionComponent<DocsContentProps> = memo(({ html }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={docsContentClass}
    />
  )
})
DocsContent.displayName = 'DocsContent'

type DocsContainerProps = {
  html: string
  loading: boolean
}

const DocsContainer: FunctionComponent<DocsContainerProps> = ({ html, loading }) => {
  const { minor: version, file } = useContext(VersionContext)

  const loadingContent = (
    <div className={docsContentClass}>
      <div className='animate-pulse w-full'>
        <div className='w-4/5 bg-gray-100 dark:bg-dark-gray-800 h-8' />
        <div className='w-2/3 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-10' />
        <div className='w-5/6 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-4/5 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-3/4 bg-gray-100 dark:bg-dark-gray-800 h-s mt-4' />
        <div className='w-2/3 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-2/4 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />

        <div className='w-2/3 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-10' />
        <div className='w-4/5 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-5/6 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-3/4 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-3/4 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-2/3 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />

        <div className='w-3/4 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-10' />
        <div className='w-4/5 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-2/3 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-5/6 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-3/4 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
        <div className='w-2/3 bg-gray-100 dark:bg-dark-gray-800 h-3 mt-4' />
      </div>
    </div>
  )

  const alerts = getDocAlerts(file, version)

  return (
    <div className='flex-1 w-0 bg-white dark:bg-dark-gray-900'>
      <div className='pt-4 pr-5 pl-5 pb-5 lg:max-w-9/10 mx-auto'>
        {!loading && alerts.map((alert, index) => <DocsAlert key={`alert-${index}`} {...alert} />)}
        {loading ? loadingContent : <DocsContent html={html} />}
      </div>
    </div>
  )
}

export default DocsContainer
