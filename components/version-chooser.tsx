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

type QuickProps = {
  stable: string[]
  beta: string[]
  versions: BedrockVersions
}

const getLink = (major: string, minor: string, file?: string) => `/docs/${major}/${minor}/${file}`

const QuickVersionChooser: FunctionComponent<QuickProps> = ({ stable, beta, versions }) => {
  const [ stableMajor, stableMinor ] = stable
  const [ betaMajor, betaMinor ] = beta

  const stableFiles = versions[stableMajor][stableMinor]
  const betaFiles = versions[betaMajor][betaMinor]

  const [stableFile, setStableFile] = useState(stableFiles[0])
  const [betaFile, setBetaFile] = useState(betaFiles[0])

  return (
    <div className='w-full text-2xl p-3 border-t border-gray-200'>
      <div className='w-full flex flex-col xl:flex-row items-start xl:items-center font-extrabold mb-2'>
        <div className='text-xl rounded-full bg-green-400 px-3 mr-2 mb-2 xl:mb-0 font-bold'>
          <span title='Stable Version'>{stableMinor}</span>
        </div>
        <div className='flex w-full xl:w-auto xl:flex-1 flex-row items-center justify-between'>
          <div className='flex flex-row items-center'>
            <span className='flex flex-row select-none'><span className='hidden xl:block'>bedrock.dev</span>/r/</span>
            <select className='my-2 md:my-0 w-full' value={stableFile} onChange={({ target: { value } }) => setStableFile(value)}>
              {stableFiles.map((file) => <option key={`s-file-${file}`} value={file}>{file}</option>)}
            </select>
          </div>

          <Link href={`/docs/[...slug]`} as={getLink(stableMajor, stableMinor, stableFile)}>
            <a className='bg-white border border-black xl:border-none hover:bg-gray-100 transition transition-150 ease-in-out text-black font-semibold py-0.5 px-2 rounded-lg text-center ml-2'>
              Go
            </a>
          </Link>
        </div>
      </div>

      <div className='w-full flex flex-col xl:flex-row items-start xl:items-center font-extrabold pt-2 border-t border-gray-200'>
        <div className='text-xl rounded-full bg-red-400 px-3 mr-2 mb-2 xl:mb-0 font-bold'>
          <span title='Beta Version'>{betaMinor}</span>
        </div>
        <div className='flex w-full xl:w-auto xl:flex-1 flex-row items-center justify-between'>
          <div className='flex flex-row items-center'>
            <span className='flex flex-row select-none'><span className='hidden xl:block'>bedrock.dev</span>/b/</span>
            <select className='my-2 md:my-0 w-full' value={betaFile} onChange={({ target: { value } }) => setBetaFile(value)}>
              {betaFiles.map((file) => <option key={`b-file-${file}`} value={file}>{file}</option>)}
            </select>
          </div>

          <Link href={`/docs/[...slug]`} as={getLink(betaMajor, betaMinor, betaFile)}>
            <a className='bg-white border border-black xl:border-none hover:bg-gray-100 transition transition-150 ease-in-out text-black font-semibold py-0.5 px-2 rounded-lg text-center ml-2'>
              Go
            </a>
          </Link>
        </div>
      </div>
    </div>
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

  const [ file, setFile ] = useState(files[0])

  let majorVersions = Object.keys(versions).sort(compareBedrockVersions)
  let minorVersions = Object.keys(versions[major]).sort(compareBedrockVersions)

  useEffect(() => {
    if (!minorVersions.includes(minor)) setMinor(minorVersions[0])
  }, [ major ])

  const link = getLink(major, minor, file)

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col bg-white border-gray-200 rounded-lg outline-none shadow shadow-sm hover:shadow-lg appearance-none hover:border-gray-300 transition duration-150 ease-in-out rounded-lg'>
        <div className='flex flex-col xl:flex-row xl:items-center text-2xl lg:text-3xl font-extrabold pl-3 pr-3 pt-3 pb-3 xl:pb-2'>
          <div className='block xl:hidden'>bedrock.dev</div>
          <span className='flex flex-row select-none'>
            <span className='hidden xl:flex'>bedrock.dev</span>
            <span>/docs/</span>
          </span>
          <div className='flex flex-row items-center'>
            <select className='my-2 xl:my-0 w-full' value={major} onChange={({ target: { value } }) => setMajor(value)}>
              {majorVersions.map((version) => <option key={`major-${version}`} value={version}>{version}</option>)}
            </select>
            <span className='select-none'>/</span>
          </div>
          <div className='flex flex-row items-center'>
            <select className='my-2 xl:my-0 w-full' value={minor} onChange={({ target: { value } }) => setMinor(value)}>
              {minorVersions.map((version) => <option key={`minor-${version}`} value={version}>{version}</option>)}
            </select>
            <span className='select-none'>/</span>
          </div>
          <div className='flex flex-row items-center'>
            <select className='my-2 xl:my-0 w-full' value={file} onChange={({ target: { value } }) => setFile(value)}>
              {files.map((file) => <option key={`file-${file}`} value={file}>{file}</option>)}
            </select>
          </div>

          <Link href={`/docs/[...slug]`} as={link}>
            {/*bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded*/}
            <a className='bg-white border border-black xl:border-none hover:bg-gray-100 transition transition-150 ease-in-out text-black font-semibold py-1 px-4 rounded-lg text-center mt-2 xl:mt-0 xl:ml-2'>
              Go
            </a>
          </Link>
        </div>

        <div className='flex w-full'>
          <QuickVersionChooser
            stable={tags.stable}
            beta={tags.beta}
            versions={versions}
          />
        </div>
        <div className='w-full p-3 border-t border-gray-200 text-center'>
          <Link href='/info'>
            <a className='link'>Info</a>
          </Link>
          {' '} • Website by <a className='link' href='https://thedestruc7i0n.ca'>TheDestruc7i0n</a>
        </div>
      </div>
    </div>
  )
}

export default VersionChooser
