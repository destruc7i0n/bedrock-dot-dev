import React, { FunctionComponent } from 'react'

import { getMinorVersionTitle } from 'lib/util'
import { TagsResponse } from 'lib/tags'

export type VersionSelectorProps = {
  majorVersions: string[]
  minorVersions: string[]

  major: string
  minor: string
  setMajor: (v: string) => void
  setMinor: (v: string) => void

  tags: TagsResponse
}

const SpecificVersionChooser: FunctionComponent<VersionSelectorProps> = ({ majorVersions, minorVersions, major, minor, setMinor, setMajor, tags }) => {
  return (
    <>
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
          {minorVersions.map((version) => {
            const title = getMinorVersionTitle([ major, version ], tags)
            return (
              <option key={`minor-${version}`} value={version}>{title}</option>
            )
          })}
        </select>
      </div>
    </>
  )
}

export default SpecificVersionChooser
