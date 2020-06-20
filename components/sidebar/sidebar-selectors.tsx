import React, { ChangeEvent, FunctionComponent, memo, useContext } from 'react'

import Router from 'next/router'

import VersionContext from '../version-context'
import { bedrockVersionsInOrder } from 'lib/bedrock-versions-transformer'

const SidebarSelectors: FunctionComponent = () => {
  // get from the context
  const { major, minor, file, versions } = useContext(VersionContext)

  if (!major || !versions) return null

  let options = []

  // generate the dropdown
  let majorVersions: string[] = []
  for (let [ major, minor ] of bedrockVersionsInOrder(versions)) {
    // only add the major version once
    if (!majorVersions.includes(major)) {
      options.push(<option key={`version-${major}`} disabled>{major}</option>)
      majorVersions.push(major)
    }
    let path = `${major}/${minor}`
    options.push(<option key={`version-${major}-${minor}`} value={path}>{minor}</option>)
  }

  const files = versions[major] && versions[major][minor]

  const onVersionChange = ({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
    const parts = value.split('/')
    const [ major, minor ] = parts
    const files = versions[major][minor]

    let newPath = [ major, minor, file ]
    // if the file isn't available go to the first one
    if (!files.includes(file)) {
      newPath[2] = files[0]
    }

    Router.push('/docs/[...slug]', `/docs/${newPath.join('/')}`)
  }

  const onFileChange = ({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
    Router.push('/docs/[...slug]', `/docs/${[ major, minor, value ].join('/')}`)
  }

  return (
    <div className='flex flex-row'>
      <div className='w-1/2'>
        <label className='block text-sm font-bold mb-1 sr-only' htmlFor='version'>Version</label>
        <select value={`${major}/${minor}`} id='version' onChange={onVersionChange} className='block w-full leading-4 form-select text-black'>
          {options}
        </select>
      </div>
      <div className='w-1/2 ml-4'>
        <label className='block text-sm font-bold mb-1 sr-only' htmlFor='file'>File</label>
        {files && (
          <select value={file} id='file' onChange={onFileChange} className='block w-full leading-4 form-select text-black'>
            {files.map((file) => <option key={`file-${file}`} value={file}>{file}</option>)}
          </select>
        )}
      </div>
    </div>
  )
}

export default memo(SidebarSelectors)
