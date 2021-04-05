import React, { FunctionComponent } from 'react'

import { useTranslation } from 'react-i18next'

import { getMinorVersionTitle } from 'lib/util'
import { TagsResponse } from 'lib/tags'

export type VersionSelectorProps = {
  majorVersions: string[]
  minorVersions: string[]

  major: string
  minor: string
  setMajor: (v: string) => void
  setMinor: (v: string) => void

  tags: TagsResponse
}

const SpecificVersionChooser: FunctionComponent<VersionSelectorProps> = ({ majorVersions, minorVersions, major, minor, setMinor, setMajor, tags }) => {
  const { t } = useTranslation('common')
  return (
    <>
      <div className='w-1/2 mb-2 pr-2'>
        <label className='block text-sm font-bold mb-2' htmlFor='major'>
          {t('component.version_chooser.major')}
        </label>
        <select id='major' className='rounded border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:text-gray-200 dark:bg-dark-gray-900 dark:border-dark-gray-800 leading-5 w-full' value={major} onChange={({ target: { value } }) => setMajor(value)}>
          {majorVersions.map((version) => <option key={`major-${version}`} value={version}>{version}</option>)}
        </select>
      </div>
      <div className='w-1/2 mb-2'>
        <label className='block text-sm font-bold mb-2' htmlFor='minor'>
          {t('component.version_chooser.minor')}
        </label>
        <select id='minor' className='rounded border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:text-gray-200 dark:bg-dark-gray-900 dark:border-dark-gray-800 leading-5 w-full' value={minor} onChange={({ target: { value } }) => setMinor(value)}>
          {minorVersions.map((version) => {
            const title = getMinorVersionTitle([ major, version ], tags, t)
            return (
              <option key={`minor-${version}`} value={version}>{title}</option>
            )
          })}
        </select>
      </div>
    </>
  )
}

export default SpecificVersionChooser
