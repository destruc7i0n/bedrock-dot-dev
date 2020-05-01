import React, { FunctionComponent, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { setOpen, SidebarContext } from './sidebar/sidebar-context'

const Header: FunctionComponent = () => {
  const router = useRouter()

  const { state: { open }, dispatch } = useContext(SidebarContext)

  const isDocsPage = router.pathname.startsWith('/docs')

  return (
    <>
      <nav className='navbar navbar-expand navbar-dark bg-dark sticky-top' id='navbar'>
        {isDocsPage && (
          <button className='btn btn-primary btn-sm mr-2 py-1 px-2' onClick={() => dispatch(setOpen(!open))}>
            &#9776;
          </button>
        )}
        <Link href='/'>
          <a className='navbar-brand mr-0'>bedrock.dev</a>
        </Link>

        <ul className='navbar-nav ml-auto'>
          <Link href='/about'>
            <a className='btn btn-primary nav-item py-1 px-2'>
              ?
            </a>
          </Link>
        </ul>
      </nav>
      <style jsx>{`
        .navbar {
          min-height: 4rem;
          max-width: 100%;
          overflow-x: auto;
        }
      `}</style>
    </>
  )
}

export default Header
