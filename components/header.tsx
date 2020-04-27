import React, { FunctionComponent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import cn from 'classnames'

import Selectors from './selectors'

import { BedrockVersions } from '../pages/api/docs/list'

type Props = {
  versions?: BedrockVersions
}

const Header: FunctionComponent<Props> = ({ versions }) => {
  const router = useRouter()
  const isDocsPage = router.pathname.startsWith('/docs')
  const centerHeader = [ '/', '/about' ].includes(router.pathname)

  return (
    <>
      <nav className='navbar navbar-expand navbar-dark bg-dark sticky-top flex-md-row-reverse' id='navbar'>
        <ul className='navbar-nav'>
          <Link href='/about'>
            <a className='btn btn-primary nav-item p-2'>
              ?
            </a>
          </Link>
        </ul>
        <Link href='/'>
          <a className={cn('navbar-brand', { 'ml-auto mr-auto': centerHeader })}>bedrock.dev</a>
        </Link>
        {isDocsPage && versions && (
          <ul className='navbar-nav mr-md-auto ml-auto ml-md-0'>
            <li className='nav-item'>
              <Selectors versions={versions}/>
            </li>
          </ul>
        )}
      </nav>
      <style jsx>{`
        .navbar {
          min-height: 4rem;
          max-width: 100%;
          overflow-x: scroll;
        }
      `}</style>
    </>
  )
}

export default Header
