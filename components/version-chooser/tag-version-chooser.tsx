import React, { FunctionComponent, useEffect, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

import { useTranslation } from 'react-i18next'

import { VersionSelectorProps } from './specific-version-chooser'
import { Tags } from 'lib/tags'

const TagVersionChooser: FunctionComponent<VersionSelectorProps> = ({ tags, setMajor, setMinor }) => {
  const { t } = useTranslation('common')
  const [ version, setVersion ] = useState(Tags.Stable)

  const updateVersion = () => {
    const [ major, minor ] = tags[version]
    unstable_batchedUpdates(() => {
      setMajor(major)
      setMinor(minor)
    })
  }

  useEffect(updateVersion, [ version ])

  return (
    <div className='w-full mb-2'>
      <label className='block text-sm font-bold mb-2' htmlFor='tag'>
        {t('component.version_chooser.tagged_version_title')}
      </label>
      <select id='tag' className='form-select dark:text-gray-200 dark:bg-dark-gray-900 dark:border-dark-gray-800 leading-5 w-full ' value={version} onChange={({ target: { value } }) => setVersion(value as Tags)}>
        <option value={Tags.Stable}>{tags.stable[1]} ({t('component.version_chooser.stable_string')})</option>
        <option value={Tags.Beta}>{tags.beta[1]} ({t('component.version_chooser.beta_string')})</option>
      </select>
    </div>
  )
}

export default TagVersionChooser
