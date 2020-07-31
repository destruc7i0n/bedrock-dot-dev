import React, { useEffect, useState } from 'react'

const icon = (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor'
       strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='w-100'>
    <polyline points='18 15 12 9 6 15' />
  </svg>
)

const BackToTop = () => {
  const [showScroll, setShowScroll] = useState(false)

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400){
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 400){
      setShowScroll(false)
    }
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
  }, [])

  return showScroll ? (
    <button className='scroll-button flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-1.5 rounded-lg' onClick={scrollTop}>
      {icon}
    </button>
  ) : null
}

export default BackToTop
