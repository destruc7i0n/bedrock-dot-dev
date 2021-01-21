import React, { FunctionComponent, memo } from 'react'

type DocsContentProps = {
  html: string
}

const docsContainerClass = 'flex-1 w-0 bg-white dark:bg-dark-gray-900'
const docsContentClass = 'docs-content text-gray-900 dark:text-gray-200 pt-4 pr-5 pl-5 pb-5 max-w-9/10 mx-auto'

const DocsContent: FunctionComponent<DocsContentProps> = memo(({ html }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={docsContentClass}
    />
  )
})

type DocsContainerProps = {
  html: string
  loading: boolean
}

const DocsContainer: FunctionComponent<DocsContainerProps> = ({ html, loading }) => {
  if (loading) {
    return (
      <div className={docsContainerClass}>
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
      </div>
    )
  }

  return (
    <div className={docsContainerClass}>
      <DocsContent html={html} />
    </div>
  )
}

export default DocsContainer
