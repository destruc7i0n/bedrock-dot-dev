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
      <header className='fixed w-full top-0 left-0 h-12 navbar flex items-center justify-between px-5'>
        <div className='flex items-center'>
          <h1 className='mr-8 text-2xl font-normal'>
            <Link href='/'>
              <a>bedrock.dev</a>
            </Link>
          </h1>
          <ul className='flex'>
            <li className='mr-5 text-lg'>
              <Link href='/about'>
                <a className='navlink'>
                  About
                </a>
              </Link>
            </li>
          </ul>
        </div>
        {isDocsPage && (
          <div className='flex md:hidden'>
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
      {/*<nav className='navbar navbar-expand navbar-dark bg-dark sticky-top' id='navbar'>*/}
      {/*  {isDocsPage && (*/}
      {/*    <button className='btn btn-primary btn-sm mr-2 py-1 px-2' onClick={() => dispatch(setOpen(!open))}>*/}
      {/*      &#9776;*/}
      {/*    </button>*/}
      {/*  )}*/}
      {/*  <Link href='/'>*/}
      {/*    <a className='navbar-brand mr-0'>bedrock.dev</a>*/}
      {/*  </Link>*/}

      {/*  <ul className='navbar-nav ml-auto'>*/}
      {/*    <Link href='/about'>*/}
      {/*      <a className='btn btn-primary nav-item py-1 px-2'>*/}
      {/*        ?*/}
      {/*      </a>*/}
      {/*    </Link>*/}
      {/*  </ul>*/}
      {/*</nav>*/}
    </>
  )
}

export default Header
