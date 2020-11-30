import React, { FunctionComponent } from 'react'
import Link from 'next/link'

import ModeSelect from './mode-select'

const HomeCard: FunctionComponent = ({ children }) => {
  return  (
    <div className='min-h-screen bg-gray-50 dark:bg-dark-gray-900'>
      <div className='flex py-24 flex-col justify-center items-center'>
        <div role='main' className='flex flex-col bg-white dark:bg-dark-gray-950 text-black dark:text-gray-200 max-w-4/5 shadow dark:shadow-none rounded-lg outline-none appearance-none transition duration-150 ease-in-out rounded-lg'>
          <div className='p-3 border-b border-gray-200 dark:border-dark-gray-800 text-center'>
            <div className='flex flex-col'>
              <h1 className='text-center text-3xl font-extrabold'>
                <Link href='/'>bedrock.dev</Link>
              </h1>
              <span>
                <span title='Not affiliated with Mojang Studios or Microsoft' className='cursor-pointer'>
                  Unofficial
                </span>
              {' '}Minecraft Bedrock Edition documentation host
              </span>
            </div>
          </div>

          {children}

          <div className='py-2 px-3 border-t border-gray-200 dark:border-dark-gray-800 text-center'>
            <div className='w-full'>
              <Link href='/packs'><a className='link'>Packs</a></Link>
              {' '} • {' '}
              <a href='https://wiki.bedrock.dev/' className='link' target='_blank' rel='noopener'>Wiki</a>
              {' '} • {' '}
              <a href='https://wiki.bedrock.dev/guide' className='link' target='_blank' rel='noopener'>Guide</a>
              {' '} • {' '}
              <a href='https://github.com/destruc7i0n/bedrock-dot-dev/' className='link' target='_blank' rel='noopener'>GitHub</a>
              {' '} • {' '}
              <a href='https://discord.gg/wAtvNQN' className='link' target='_blank' rel='noopener'>Discord</a>
            </div>
          </div>

          <div className='px-3'>
            <div className='py-2 border-t border-gray-200 dark:border-dark-gray-800 text-center'>
              Website by {' '}
              <a className='link' href='https://thedestruc7i0n.ca' target='_blank' rel='noopener'>
                TheDestruc7i0n
              </a>
              {' '} • {' '}
              <a href='https://patreon.com/destruc7i0n' className='link' target='_blank' rel='noopener'>Donate</a>
            </div>
          </div>
        </div>

        <div className='mt-2'>
          <ModeSelect />
        </div>
      </div>
    </div>
  )
}

export default HomeCard
