import React, { FunctionComponent, useContext } from 'react'
import Link from 'next/link'

import { setOpen, SidebarContext } from './sidebar/sidebar-context'
import { useRouter } from 'next/router';

const Header: FunctionComponent = () => {
  const router = useRouter()

  const { state: { open }, dispatch } = useContext(SidebarContext)

  const isDocsPage = router.pathname.startsWith('/docs')

  return (
    <>
      <header className='navbar fixed w-full top-0 left-0 h-12 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-5'>
        <div className='flex items-center'>
          <h1 className='mr-8 text-2xl font-normal'>
            <Link href='/'>
              <a className='hover:text-gray-900'>bedrock.dev</a>
            </Link>
          </h1>
          <ul className='flex'>
            <li className='text-lg'>
              <Link href='/info'>
                <a className='flex items-center h=8 p-2 rounded text-gray-500 hover:text-gray-900'>
                  Info
                </a>
              </Link>
            </li>
          </ul>
        </div>
        {isDocsPage && (
          <div className='flex lg:hidden'>
            <button onClick={() => dispatch(setOpen(!open))}>
              <svg fill='currentColor' className='w-6 h-6' viewBox='0 0 20 20'>
                <path
                  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                  fillRule='evenodd'
                />
              </svg>
            </button>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
