import React from 'react'
import Link from 'next/link'

import { useTranslation } from 'next-i18next'

const HomepageNavbar = () => {
  const { t } = useTranslation('common')

  return (
    <div className='py-6'>
      <nav className='mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 max-w-screen-lg lg:p-0'>
        <Link href='/' className='flex items-center'>
          <div className='font-normal text-gray-900 dark:text-white leading-tight text-2xl tracking-tight'>bedrock.dev</div>
        </Link>
        <div className='flex items-center'>
          <a className='ml-6 lg:ml-10 font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition duration-150 ease-in-out' href='https://wiki.bedrock.dev' target='_blank' rel='noopener'>{t('component.header.wiki_link')}</a>
          <Link
            href='/packs'
            className='ml-6 lg:ml-10 font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition duration-150 ease-in-out'>
            {t('component.header.packs_link')}
          </Link>
          <a className='ml-6 lg:ml-10 font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition duration-150 ease-in-out' href='https://discord.gg/wAtvNQN' target='_blank' rel='noopener'>{t('component.header.discord_link')}</a>
        </div>
      </nav>
    </div>
  )
}

export default HomepageNavbar
