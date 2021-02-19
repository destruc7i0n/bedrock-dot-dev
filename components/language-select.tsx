import React, { FunctionComponent, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { Locale } from '../lib/i18n'

const LanguageSelect: FunctionComponent = () => {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [localeValue, setLocaleValue] = useState(router.locale ?? Locale.English)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (localeValue !== router.locale) {
      // navigate to same path in another langauge
      router.push(router.route, router.asPath, { locale: localeValue })
    }
  }, [localeValue])

  if (!mounted) return null

  return (
    <div className='relative dark:text-gray-200'>
      <label className='block text-sm font-bold mb-1 sr-only' htmlFor='mode'>Mode Select</label>
      <select value={localeValue} onChange={({ target: { value } }) => setLocaleValue(value as Locale)} id='mode' className='leading-3 form-select dark:bg-dark-gray-900 dark:border-dark-gray-800 text-sm py-2 pl-2 block'>
        <option value={Locale.English}>EN</option>
        <option value={Locale.Chinese}>ZH</option>
      </select>
    </div>
  )
}

export default LanguageSelect
