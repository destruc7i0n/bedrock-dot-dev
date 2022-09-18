import React, { FunctionComponent, memo } from 'react'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { useTranslation } from 'next-i18next'

type Props = {
  value: string
  setValue: (value: string) => void
}

const SidebarFilter: FunctionComponent<Props> = ({ value, setValue }) => {
  const { t } = useTranslation('common')
  return (
    <div className='mt-4'>
      <label className='block text-sm font-bold mb-1 sr-only' htmlFor='filter'>{t('component.sidebar.filter_title')}</label>
      <div className='relative w-full rounded-lg'>
        <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none'>
          <span className='text-gray-500 leading-4'>
            <MagnifyingGlassIcon className='pointer-events-none w-4 h-4' />
          </span>
        </div>
        <input
          id='filter'
          className='border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-8 xl:pl-7 px-4 block w-full leading-4 bg-white dark:text-gray-200 dark:bg-dark-gray-900 dark:border-dark-gray-800 dark:placeholder-gray-400'
          type='text'
          placeholder={t('component.sidebar.filter_title')}
          value={value}
          onChange={({ target: { value } }) => setValue(value)}
        />
      </div>
    </div>
  )
}

export default memo(SidebarFilter)
