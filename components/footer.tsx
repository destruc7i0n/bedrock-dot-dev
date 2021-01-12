import React, { FunctionComponent } from 'react'

import cn from 'classnames'

import ModeSelect from './mode-select'

type Props = {
  darkClassName?: string
  dark?: boolean,
  outline?: boolean
  modeSelect?: boolean
}

const Footer: FunctionComponent<Props> = ({ darkClassName = 'bg-dark-gray-950', dark = false, outline = true, modeSelect = true }) => {
  const darkClass = 'bg-gray-50 dark:' + darkClassName
  return (
    <div className={cn('w-full py-12 px-4 overflow-hidden sm:px-6 lg:px-8', { [darkClass]: dark }, { 'border-t border-gray-200 dark:border-dark-gray-800': outline })}>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-wrap justify-center font-medium'>
          <div className='px-2 pb-3 text-gray-500 dark:text-gray-300'>
            Website by {' '}
            <a className='link' href='https://thedestruc7i0n.ca' target='_blank' rel='noopener'>
              TheDestruc7i0n
            </a>
          </div>
          <div className='px-2 pb-3'>
            <a href='https://patreon.com/destruc7i0n' className='link' target='_blank' rel='noopener'>Donate</a>
          </div>
        </div>
        <div className='flex flex-wrap justify-center font-medium'>
          <div className='px-2 pb-3'>
            <a className='link' href='https://github.com/destruc7i0n/bedrock-dot-dev' target='_blank' rel='noopener'>GitHub</a>
          </div>
        </div>
        <div className='flex flex-wrap justify-center text-gray-500 dark:text-gray-400 font-medium'>
          <div className='px-2 pb-3'>
            <p>This website is not affiliated with Mojang Studios</p>
          </div>
        </div>

        {modeSelect && <div className='mt-6 flex justify-center'>
          <ModeSelect />
        </div>}
      </div>
    </div>
  )
}

export default Footer
