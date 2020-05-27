import React, { FunctionComponent, memo } from 'react'

type Props = {
  value: string
  setValue: (value: string) => void
}

const SidebarFilter: FunctionComponent<Props> = ({ value, setValue }) => {
  return (
    <div className='relative w-full rounded-lg mt-4'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <span className='text-gray-500 leading-4'>
          <svg className='fill-current pointer-events-none w-4 h-4 xl:w-3 xl:h-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
            <path d='M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z' />
          </svg>
        </span>
      </div>
      <input
        className='form-input bg-white pl-8 xl:pl-7 px-4 block w-full leading-4'
        type='text'
        placeholder='Filter'
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
      />
    </div>
  )
}

export default memo(SidebarFilter)
