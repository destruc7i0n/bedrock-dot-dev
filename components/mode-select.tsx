import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'

enum Theme {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

const svgClass = 'pointer-events-none w-4 h-4'
const icons = {
  system: (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor'
         strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={svgClass}>
      <rect x='2' y='3' width='20' height='14' rx='2' ry='2' />
      <line x1='8' y1='21' x2='16' y2='21' />
      <line x1='12' y1='17' x2='12' y2='21' />
    </svg>
  ),
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
  [Theme.System]: {
    icon: icons.system
  },
  [Theme.Light]: {
    icon: icons.sun
  },
  [Theme.Dark]: {
    icon: icons.moon
  },
}

const ModeSelect: FunctionComponent = () => {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>(Theme.System)
  const [themeName, setThemeName] = useState<Theme>(Theme.System)

  // refresh the theme from the localstorage
  useEffect(() => {
    try {
      const pref = localStorage.getItem('theme') as Theme
      if (pref) handleChange(pref)
    } catch (e) {}
    setMounted(true)
  }, [])

  // update the theme of the page
  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark-mode')
    } else if (theme === Theme.Light) {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [ theme, themeName ])

  // callback when the system theme changes
  const listenerCallback = useCallback((e: MediaQueryList | MediaQueryListEvent) => {
    setTheme(e.matches ? Theme.Dark : Theme.Light)
  }, [])

  // listener to the system theme change
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    // only update based on system once the localstorage has been checked
    if (themeName === Theme.System && mounted) {
      query.addListener(listenerCallback)
      listenerCallback(query)
    }
    return () => query.removeListener(listenerCallback)
  }, [ theme, themeName, mounted ])

  // update the preferred theme from the dropdown
  const handleChange = useCallback((value: Theme) => {
    setThemeName(value)
    setTheme(value)
    try {
      window.localStorage.setItem('theme', value)
    } catch (e) {}
  }, [])

  return (
    <div className='relative dark:text-gray-200'>
      <label className='block text-sm font-bold mb-1 sr-only' htmlFor='mode'>Mode Select</label>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
        <span className='leading-3'>
          {themes[themeName].icon}
        </span>
      </div>
      <select value={themeName} onChange={({ target: { value } }) => handleChange(value as Theme)} id='mode' className='leading-3 form-select dark:bg-dark-gray-900 dark:border-dark-gray-800 text-sm py-2 pl-8 block'>
        <option value={Theme.System}>System</option>
        <option value={Theme.Dark}>Dark</option>
        <option value={Theme.Light}>Light</option>
      </select>
    </div>
  )
}

export default ModeSelect
