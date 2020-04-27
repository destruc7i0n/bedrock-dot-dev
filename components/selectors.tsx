import React, { ChangeEvent, FunctionComponent, useContext } from 'react'

import Router from 'next/router'

import { BedrockVersions } from '../pages/api/docs/list'
import { compareBedrockVersions } from '../lib/util'

import LocationContext from './location-context'

type Props = {
  versions: BedrockVersions | null
}

const Selectors: FunctionComponent<Props> = ({ versions }) => {
  if (!versions) return null

  // get from the context
  const { major, minor, file } = useContext(LocationContext)

  if (!major) return null

  const majorVersionsOrdered = Object.keys(versions).sort(compareBedrockVersions).reverse()

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
    <div className='d-flex flex-row'>
      <select value={`${major}/${minor}`} onChange={onVersionChange}>
        {options}
      </select>
      {files && (
        <select value={file} onChange={onFileChange} className='ml-2'>
          {files.map((file) => <option key={`file-${file}`} value={file}>{file}</option>)}
        </select>
      )}
    </div>
  )
}

export default Selectors
