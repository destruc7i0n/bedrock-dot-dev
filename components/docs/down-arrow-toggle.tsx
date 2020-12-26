import React, { FunctionComponent } from 'react'

const DownArrowToggle: FunctionComponent<{ click: () => void }> = ({ click }) => (
  <div className='w-full flex justify-center hover:bg-gray-100 dark:bg-dark-gray-800 rounded-b-lg transition transition-150 ease-in-out text-sm py-0.5 cursor-pointer' onClick={click}>
    <svg aria-hidden='true' focusable='false'
         className='w-5 h-5' xmlns='http://www.w3.org/2000/svg'
         viewBox='0 0 320 512'>
      <path fill='currentColor' d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z' />
    </svg>
  </div>
)

export default DownArrowToggle
