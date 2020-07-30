import React, { FunctionComponent, useEffect, useState } from 'react'

const svgClass = 'pointer-events-none w-4 h-4'
const icons = {
  // system: (
  //   <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor'
  //        stroke-width='2' stroke-linecap='round' stroke-linejoin='round' className={svgClass}>
  //     <rect x='2' y='3' width='20' height='14' rx='2' ry='2' />
  //     <line x1='8' y1='21' x2='16' y2='21' />
  //     <line x1='12' y1='17' x2='12' y2='21' />
  //   </svg>
  // ),
  moon: (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor'
         strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={svgClass}>
      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
    </svg>
  ),
  sun: (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor'
         strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={svgClass}>
      <circle cx='12' cy='12' r='5' />
      <line x1='12' y1='1' x2='12' y2='3' />
      <line x1='12' y1='21' x2='12' y2='23' />
      <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
      <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
      <line x1='1' y1='12' x2='3' y2='12' />
      <line x1='21' y1='12' x2='23' y2='12' />
      <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
      <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
    </svg>
  ),
}

const themes = {
  // system: {
  //   icon: icons.system
  // },
  light: {
    icon: icons.sun
  },
  dark: {
    icon: icons.moon
  },
}
type ThemeStrings = keyof typeof themes

const ModeSelect: FunctionComponent = () => {
  const [ theme, setTheme ] = useState<ThemeStrings>('light')

  useEffect(() => {
    if (document.documentElement.classList.contains('dark-mode')) setTheme('dark')
    else setTheme('light')
  }, [])

  const handleChange = (value: ThemeStrings) => {
    switch (value) {
      case 'dark': {
        document.documentElement.classList.add('dark-mode');
        break
      }
      case 'light': {
        document.documentElement.classList.remove('dark-mode');
        break
      }
      default:
        break
    }
    if (theme !== value && window.localStorage) {
      localStorage.setItem('theme', value)
      setTheme(value)
    }
  }

  return (
    <div className='relative dark:text-gray-200'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
        <span className='leading-3'>
          {themes[theme].icon}
        </span>
      </div>
      <select value={theme} onChange={({ target: { value } }) => handleChange(value as ThemeStrings)} id='mode' className='leading-3 form-select dark:bg-dark-gray-900 dark:border-dark-gray-800 text-sm py-2 pl-8 block'>
        <option value='dark'>Dark</option>
        <option value='light'>Light</option>
      </select>
    </div>
  )
}

export default ModeSelect
