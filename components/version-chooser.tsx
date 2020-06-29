import React, { FunctionComponent, useEffect, useState } from 'react'

import Router from 'next/router'
import Link from 'next/link'

import SpecificVersionChooser from './version-chooser/specific-version-chooser'
import TagVersionChooser from './version-chooser/tag-version-chooser'

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
      <a className='link truncate w-1/2 px-2 py-1 text-lg'>{title}</a>
    </Link>
  )
}

type VersionChooserProps = {
  versions: BedrockVersions
  tags: TagsResponse
}

const VersionChooser: FunctionComponent<VersionChooserProps> = ({ versions, tags }) => {
  const [quickSelect, setQuickSelect] = useState(true)

  // set from query string if possible
  useEffect(() => {
    let parsedUrlQuery: ParsedUrlResponse = { major: '', minor: '' }

    const { query } = Router
    if (query?.r && typeof query.r === 'string') {
      parsedUrlQuery = parseUrlQuery(query.r, versions)

      setQuickSelect(false)
      if (parsedUrlQuery.major) setMajor(parsedUrlQuery.major)
      if (parsedUrlQuery.minor) setMinor(parsedUrlQuery.minor)
    }
  }, [])

  const [ stableMajor, stableMinor ] = tags[Tags.Stable]

  // initialize to the current stable version
  const [ major, setMajor ] = useState(stableMajor)
  const [ minor, setMinor ] = useState(stableMinor)

  let files: string[] = []
  if (versions[major] && versions[major][minor]) {
    files = versions[major][minor]
  }

  let majorVersions = Object.keys(versions).sort(compareBedrockVersions)
  let minorVersions = Object.keys(versions[major]).sort(compareBedrockVersions)

  // if the major version changes, set the minor to the latest minor from that major version
  useEffect(() => {
    if (!minorVersions.includes(minor)) setMinor(minorVersions[0])
  }, [ major ])

  const VersionChooserComponent = quickSelect ? TagVersionChooser : SpecificVersionChooser

  return (
    <>
      <div className='flex flex-col xl:items-center text-xl font-normal p-3'>
        <h2 className='w-full pb-3 text-xl font-bold'>
          Version Selection
        </h2>
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
              <span className='ml-2 text-sm select-none'>View all versions</span>
            </label>
          </div>
        </div>

        <div className='w-full flex flex-col mt-2'>
          <label className='block text-sm font-bold mb-2'>
            File Selection
          </label>
          <div className='version-files-container overflow-y-auto w-full flex flex-wrap bg-gray-50 border border-gray-200 p-2 rounded-lg'>
            {files.map((file) => (
              <VersionFile key={`file-${file}-${minor}`} title={file} link={getLink(major, minor, file, tags)} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default VersionChooser
