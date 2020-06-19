import React, { FunctionComponent, useEffect, useState } from 'react'

import cn from 'classnames'

import Router from 'next/router'
import Link from 'next/link'

import { compareBedrockVersions } from '../lib/util'
import { TagsResponse } from '../lib/files'
import { BedrockVersions } from '../lib/versions'

type ParsedUrlResponse = {
  major: string
  minor: string
}

const parseUrlQuery = (query: string, versions: BedrockVersions): ParsedUrlResponse => {
  const parts = query.split('/')

  let parsed: ParsedUrlResponse = { major: '', minor: '' }
  const [ major, minor ] = parts

  if (major && versions[major]) {
    parsed['major'] = parts[0]
    if (minor && versions[major][minor]) {
      parsed['minor'] = parts[1]
    }
  }

  return parsed
}

const getLink = (major: string, minor: string, file?: string) => `/docs/${major}/${minor}/${file}`

type QuickVersionChooserProps = {
  title: string
  id: string
  directory: string
  color: 'red' | 'green'
  margin?: boolean
  version: string[]
  versions: BedrockVersions
}

const QuickVersionChooser: FunctionComponent<QuickVersionChooserProps> = ({ title, id, directory, color, margin = true, version, versions }) => {
  const [ major, minor ] = version

  const files = versions[major][minor]

  const [file, setFile] = useState('Entities')

  return (
    <div className={cn('w-full flex flex-col md:flex-row items-start md:items-center pb-3', { 'border-t border-gray-200': margin })}>
      <div className={`text-base font-bold rounded-full ${color === 'red' ? 'bg-red-400' : 'bg-green-400'} px-3 mr-2 xl:mb-0`}>
        <span title={`${title} Version`}>
          {minor}
        </span>
      </div>
      <div className='flex w-full xl:w-auto xl:flex-1 flex-row items-center justify-between'>
        <div className='flex flex-1 flex-row items-center text-lg font-semibold'>
          <label htmlFor={id} className='flex flex-row select-none mr-1'><span className='hidden xl:block'>bedrock.dev</span>/{directory}/</label>
          <select id={id} className='form-select leading-3 bg-white my-2 md:my-0 w-full' value={file} onChange={({ target: { value } }) => setFile(value)}>
            {files.map((file) => <option key={`${id}-file-${file}`} value={file}>{file}</option>)}
          </select>
        </div>

        <Link href={`/docs/[...slug]`} as={getLink(major, minor, file)}>
          <button className='bg-white leading-4 border border-black xl:border-none hover:bg-gray-100 transition transition-150 ease-in-out text-black font-semibold py-2 px-2 rounded-lg text-center ml-2' title={`Go to latest ${title} version`}>
            Go
          </button>
        </Link>
      </div>
    </div>
  )
}

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
  // set from query string if possible
  useEffect(() => {
    let parsedUrlQuery: ParsedUrlResponse = { major: '', minor: '' }

    const { query } = Router
    if (query?.r && typeof query.r === 'string') {
      parsedUrlQuery = parseUrlQuery(query.r, versions)

      if (parsedUrlQuery.major) setMajor(parsedUrlQuery.major)
      if (parsedUrlQuery.minor) setMinor(parsedUrlQuery.minor)
    }
  }, [])

  const [ stableMajor, stableMinor ] = tags.stable

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

  return (
    <>
      <div className='flex flex-col xl:items-center text-xl font-normal p-3'>
        <h3 className='w-full pb-3 text-xl font-bold'>
          Version Selection
        </h3>
        <div className='w-full flex flex-row'>
          <div className='w-1/2 mb-2 pr-2'>
            <label className='block text-sm font-bold mb-2' htmlFor='major'>
              Major
            </label>
            <select id='major' className='form-select leading-5 w-full' value={major} onChange={({ target: { value } }) => setMajor(value)}>
              {majorVersions.map((version) => <option key={`major-${version}`} value={version}>{version}</option>)}
            </select>
          </div>
          <div className='w-1/2 mb-2'>
            <label className='block text-sm font-bold mb-2' htmlFor='minor'>
              Minor
            </label>
            <select id='minor' className='form-select leading-5 w-full' value={minor} onChange={({ target: { value } }) => setMinor(value)}>
              {minorVersions.map((version) => <option key={`minor-${version}`} value={version}>{version}</option>)}
            </select>
          </div>
        </div>

        <div className='w-full flex flex-col mt-2'>
          <label className='block text-sm font-bold mb-2'>
            File Selection
          </label>
          <div className='version-files-container overflow-y-auto w-full flex flex-wrap bg-gray-50 border border-gray-200 p-2 rounded-lg'>
            {files.map((file) => (
              <VersionFile key={`file-${file}-${minor}`} title={file} link={getLink(major, minor, file)} />
            ))}
          </div>
        </div>
      </div>

      <div className='flex w-full'>
        <div className='w-full px-3 border-t border-gray-200'>
          <h3 className='w-full py-3 text-xl font-bold'>
            Latest Version Selection
          </h3>
          <QuickVersionChooser title='Stable' versions={versions} version={tags.stable} directory='r' id='stable' color='green' margin={false} />
          <QuickVersionChooser title='Beta' versions={versions} version={tags.beta} directory='b' id='beta' color='red' margin={false} />
        </div>
      </div>
    </>
  )
}

export default VersionChooser
