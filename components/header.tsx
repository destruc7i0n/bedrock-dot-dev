import React, { FunctionComponent, memo, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { SidebarContext } from './sidebar/sidebar-context'

const HeaderLink: FunctionComponent<{ link: string, title: string }> = ({ link, title }) => (
  <li className='text-lg'>
    <a
      className='flex items-center p-2 rounded text-gray-500 hover:text-gray-900 dark-hover:text-gray-400 transition duration-150 ease-in-out'
      href={link}
      target='_blank' rel='noopener'
    >
      {title}
    </a>
  </li>
)

const Header: FunctionComponent = () => {
  const router = useRouter()

  const { open, setOpen } = useContext(SidebarContext)

  const isDocsPage = router.pathname.startsWith('/docs')

  const toggleButton = (
    <button onClick={() => setOpen(!open)} className='no-double-tap-zoom' aria-label='Toggle navbar'>
      <svg fill='currentColor' className='w-6 h-6' viewBox='0 0 20 20'>
        <path
          d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
          clipRule='evenodd'
          fillRule='evenodd'
        />
      </svg>
    </button>
  )

  return (
    <>
      <header className='navbar sticky w-full top-0 left-0 h-12 bg-gray-50 dark:bg-dark-gray-975 border-b border-gray-200 dark:border-dark-gray-800 px-4'>
        <div className='flex items-center justify-between mx-auto text-gray-900 dark:text-gray-200'>
          <div className='flex items-center'>
            {isDocsPage && (
              <div className='hidden lg:flex mr-2'>
                {toggleButton}
              </div>
            )}
            <h1 className='mr-6 text-2xl font-normal'>
              <Link href='/'>
                <a className='text-black hover:text-gray-900 dark:text-white dark-hover:text-white'>bedrock.dev</a>
              </Link>
            </h1>
            <ul className='flex'>
              <HeaderLink link='https://wiki.bedrock.dev' title='Wiki' />
              <HeaderLink link='https://guide.bedrock.dev' title='Guide' />
            </ul>
          </div>
          {isDocsPage && (
            <div className='flex lg:hidden'>
              {toggleButton}
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default memo(Header)
