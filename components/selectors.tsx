import React, { ChangeEvent, FunctionComponent, useContext } from 'react'

import Router from 'next/router'

import { compareBedrockVersions } from '../lib/util'

import VersionContext from './version-context'

const Selectors: FunctionComponent = () => {
  // get from the context
  const { major, minor, file, versions } = useContext(VersionContext)

  if (!major || !versions) return null

  const majorVersionsOrdered = Object.keys(versions).sort(compareBedrockVersions)

  let options = []

  for (let major of majorVersionsOrdered) {
    options.push(<option key={`version-${major}`} disabled>{major}</option>)

    const minorVersions = Object.keys(versions[major]).sort(compareBedrockVersions)
    for (let minor of minorVersions) {
      let path = `${major}/${minor}`
      options.push(<option key={`version-${major}-${minor}`} value={path}>{minor}</option>)
    }
  }

  const files = versions[major] && versions[major][minor]

  const onVersionChange = ({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
    const parts = value.split('/')
    const [ major, minor ] = parts
    const files = versions[major][minor]

    let newPath = [ major, minor, file ]
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
        <select value={`${major}/${minor}`} onChange={onVersionChange} className='block w-full leading-4 form-select text-black'>
          {options}
        </select>
      </div>
      <div className='w-1/2 ml-2'>
        {files && (
          <select value={file} onChange={onFileChange} className='block w-full leading-4 form-select text-black'>
            {files.map((file) => <option key={`file-${file}`} value={file}>{file}</option>)}
          </select>
        )}
      </div>
    </div>
  )
}

export default Selectors
