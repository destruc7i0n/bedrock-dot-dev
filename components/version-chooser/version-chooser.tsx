import React, { FunctionComponent, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import Link from 'next/link'

import { useTranslation } from 'react-i18next'

import SpecificVersionChooser from './specific-version-chooser'
import TagVersionChooser from './tag-version-chooser'

import {
  compareBedrockVersions,
  getLink,
  ParsedUrlResponse,
  parseUrlQuery
} from 'lib/util'
import { BedrockVersions } from 'lib/versions'
import { Tags, TagsResponse } from 'lib/tags'

type VersionFileProps = {
  title: string
  link: string
}

const VersionFile: FunctionComponent<VersionFileProps> = ({ title, link }) => {
  return (
    <Link href={`/docs/[...slug]`} as={link}>
      <a className='link truncate w-1/2 lg:w-1/3 px-2 py-1 text-lg'>{title}</a>
    </Link>
  )
}

type VersionChooserProps = {
  versions: BedrockVersions
  tags: TagsResponse
}

const VersionChooser: FunctionComponent<VersionChooserProps> = ({ versions, tags }) => {
  const { t } = useTranslation('common')
  const [quickSelect, setQuickSelect] = useState(true)

  const router = useRouter()
  const { query } = router

  // set from query string if possible
  useEffect(() => {
    let parsedUrlQuery: ParsedUrlResponse = { major: '', minor: '' }

    if (query?.r && typeof query.r === 'string') {
      parsedUrlQuery = parseUrlQuery(query.r, versions)

      setQuickSelect(false)
      if (parsedUrlQuery.major) setMajor(parsedUrlQuery.major)
      if (parsedUrlQuery.minor) setMinor(parsedUrlQuery.minor)
    }
  }, [ query ])

  const [ stableMajor, stableMinor ] = tags[Tags.Stable]

  // initialize to the current stable version
  const [ major, setMajor ] = useState(stableMajor)
  const [ minor, setMinor ] = useState(stableMinor)

  let files: string[] = []
  if (versions[major] && versions[major][minor]) {
    files = versions[major][minor]
  }

  let majorVersions = Object.keys(versions).sort(compareBedrockVersions)
  let minorVersions = Object.keys(versions?.[major]).sort(compareBedrockVersions)

  // if the major version changes, set the minor to the latest minor from that major version
  useEffect(() => {
    if (!minorVersions.includes(minor)) setMinor(minorVersions[0])
  }, [ major ])

  const VersionChooserComponent = quickSelect ? TagVersionChooser : SpecificVersionChooser

  return (
    <>
      <div className='w-full flex flex-col'>
        <div className='w-full flex flex-row'>
          <VersionChooserComponent
            major={major}
            minor={minor}
            majorVersions={majorVersions}
            minorVersions={minorVersions}
            setMajor={setMajor}
            setMinor={setMinor}
            tags={tags}
          />
        </div>
        <div className='w-full'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              className='form-checkbox'
              checked={!quickSelect}
              onChange={({ target: { checked } }) => setQuickSelect(!checked)}
            />
            <span className='ml-2 text-sm select-none'>{t('component.version_chooser.view_all')}</span>
          </label>
        </div>
      </div>

      <div className='w-full flex flex-col mt-2'>
        <label className='block text-sm font-bold mb-2'>
          {t('component.version_chooser.file_selection')}
        </label>
        <div className='overflow-y-auto w-full flex flex-wrap bg-gray-50 dark:bg-dark-gray-900 border border-gray-200 dark:border-dark-gray-800 p-2 rounded-lg'>
          {files.map((file) => (
            <VersionFile key={`file-${file}-${minor}`} title={file} link={getLink(major, minor, file, tags, quickSelect)} />
          ))}
        </div>
      </div>
    </>
  )
}

export default VersionChooser
