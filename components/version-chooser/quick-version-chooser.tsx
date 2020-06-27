import React, { FunctionComponent, useState } from 'react'
import Link from 'next/link'

import { Tags, TagsResponse } from 'lib/tags'
import { BedrockVersions } from 'lib/versions'
import { getLink } from 'lib/util'

type Props = {
  title: string
  id: Tags
  directory: string
  color: 'red' | 'green'
  tags: TagsResponse
  versions: BedrockVersions
}

const QuickVersionChooser: FunctionComponent<Props> = ({ title, id, directory, color, tags, versions }) => {
  const version = tags[id]
  const [ major, minor ] = version

  const files = versions[major][minor]

  const [file, setFile] = useState('Entities')

  return (
    <div className='w-full flex flex-col md:flex-row items-start md:items-center pb-3'>
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

        <Link href={`/docs/[...slug]`} as={getLink(major, minor, file, tags)}>
          <button className='bg-white leading-4 border border-black xl:border-none hover:bg-gray-100 transition transition-150 ease-in-out text-black font-semibold py-2 px-2 rounded-lg text-center ml-2' title={`Go to latest ${title} version`}>
            Go
          </button>
        </Link>
      </div>
    </div>
  )
}

export default QuickVersionChooser
