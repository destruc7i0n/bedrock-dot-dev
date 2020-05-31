import React, { FunctionComponent, useEffect, useState } from 'react'

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

  if (parts.length > 0 && versions[parts[0]]) {
    parsed['major'] = parts[0]
    if (parts.length > 1 && versions[parts[0]][parts[1]]) {
      parsed['minor'] = parts[1]
    }
  }

  return parsed
}

const getLink = (major: string, minor: string, file?: string) => `/docs/${major}/${minor}/${file}`

type QuickProps = {
  stable: string[]
  beta: string[]
  versions: BedrockVersions
}

const QuickVersionChooser: FunctionComponent<QuickProps> = ({ stable, beta, versions }) => {
  const [ stableMajor, stableMinor ] = stable
  const [ betaMajor, betaMinor ] = beta

  const stableFiles = versions[stableMajor][stableMinor]
  const betaFiles = versions[betaMajor][betaMinor]

  const [stableFile, setStableFile] = useState('Entities')
  const [betaFile, setBetaFile] = useState('Entities')

  return (
    <div className='w-full text-2xl p-3 border-t border-gray-200'>
      <div className='w-full flex flex-col xl:flex-row items-start xl:items-center font-bold mb-2'>
        <div className='text-xl rounded-full bg-green-400 px-3 mr-2 mb-2 xl:mb-0 font-bold'>
          <span title='Stable Version'>{stableMinor}</span>
        </div>
        <div className='flex w-full xl:w-auto xl:flex-1 flex-row items-center justify-between'>
          <div className='flex flex-1 flex-row items-center'>
            <label htmlFor='stable' className='flex flex-row select-none'><span className='hidden xl:block'>bedrock.dev</span>/r/</label>
            <select id='stable' className='bg-white my-2 md:my-0 w-full' value={stableFile} onChange={({ target: { value } }) => setStableFile(value)}>
              {stableFiles.map((file) => <option key={`s-file-${file}`} value={file}>{file}</option>)}
            </select>
          </div>

          <Link href={`/docs/[...slug]`} as={getLink(stableMajor, stableMinor, stableFile)}>
            <a className='bg-white border border-black xl:border-none hover:bg-gray-100 transition transition-150 ease-in-out text-black font-semibold py-1 px-2 rounded-lg text-center ml-2'>
              Go
            </a>
          </Link>
        </div>
      </div>

      <div className='w-full flex flex-col xl:flex-row items-start xl:items-center font-bold pt-3 border-t border-gray-200'>
        <div className='text-xl rounded-full bg-red-400 px-3 mr-2 mb-2 xl:mb-0 font-bold'>
          <span title='Beta Version'>{betaMinor}</span>
        </div>
        <div className='flex w-full xl:w-auto xl:flex-1 flex-row items-center justify-between'>
          <div className='flex flex-1 flex-row items-center'>
            <label htmlFor='beta' className='flex flex-row select-none'><span className='hidden xl:block'>bedrock.dev</span>/b/</label>
            <select id='beta' className='bg-white my-2 md:my-0 w-full' value={betaFile} onChange={({ target: { value } }) => setBetaFile(value)}>
              {betaFiles.map((file) => <option key={`b-file-${file}`} value={file}>{file}</option>)}
            </select>
          </div>

          <Link href={`/docs/[...slug]`} as={getLink(betaMajor, betaMinor, betaFile)}>
            <a className='bg-white border border-black xl:border-none hover:bg-gray-100 transition transition-150 ease-in-out text-black font-semibold py-1 px-2 rounded-lg text-center ml-2'>
              Go
            </a>
          </Link>
        </div>
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
      <a className='link truncate w-1/2 p-2 text-base xl:text-lg'>{title}</a>
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
    if (query && query.r && typeof query.r === 'string') {
      parsedUrlQuery = parseUrlQuery(query.r, versions)

      if (parsedUrlQuery.major) setMajor(parsedUrlQuery.major)
      if (parsedUrlQuery.minor) setMinor(parsedUrlQuery.minor)
    }
  }, [])

  const [ stableMajor, stableMinor ] = tags.stable

  const [ major, setMajor ] = useState(stableMajor)
  const [ minor, setMinor ] = useState(stableMinor)

  let files: string[] = []
  if (versions[major] && versions[major][minor]) {
    files = versions[major][minor]
  }

  let majorVersions = Object.keys(versions).sort(compareBedrockVersions)
  let minorVersions = Object.keys(versions[major]).sort(compareBedrockVersions)

  useEffect(() => {
    if (!minorVersions.includes(minor)) setMinor(minorVersions[0])
  }, [ major ])

  return (
    <>
      <div className='flex flex-col xl:items-center text-xl font-normal p-3'>
        <div className='w-full flex flex-row'>
          <div className='w-1/2 mb-2 pr-2'>
            <label className='block text-sm font-bold mb-2' htmlFor='major'>
              Major
            </label>
            <select id='major' className='bg-white w-full' value={major} onChange={({ target: { value } }) => setMajor(value)}>
              {majorVersions.map((version) => <option key={`major-${version}`} value={version}>{version}</option>)}
            </select>
          </div>
          <div className='w-1/2 mb-2'>
            <label className='block text-sm font-bold mb-2' htmlFor='minor'>
              Minor
            </label>
            <select id='minor' className='bg-white w-full' value={minor} onChange={({ target: { value } }) => setMinor(value)}>
              {minorVersions.map((version) => <option key={`minor-${version}`} value={version}>{version}</option>)}
            </select>
          </div>
        </div>

        <div className='w-full flex flex-col mt-2'>
          <label className='block text-sm font-bold mb-2'>
            Files
          </label>
          <div className='version-files-container overflow-y-auto w-full flex flex-wrap bg-gray-50 border border-gray-200 p-2 rounded-lg'>
            {files.map((file) => (
              <VersionFile title={file} link={getLink(major, minor, file)} />
            ))}
          </div>
        </div>
      </div>

      <div className='flex w-full'>
        <QuickVersionChooser
          stable={tags.stable}
          beta={tags.beta}
          versions={versions}
        />
      </div>
    </>
  )
}

export default VersionChooser
