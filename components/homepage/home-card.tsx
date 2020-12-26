import React, { FunctionComponent } from 'react'

const HomeCard: FunctionComponent = ({ children }) => {
  return  (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col bg-white dark:bg-dark-gray-950 text-black dark:text-gray-200 rounded-lg outline-none appearance-none transition duration-150 ease-in-out rounded-lg'>
        {children}
      </div>
    </div>
  )
}

export default HomeCard
