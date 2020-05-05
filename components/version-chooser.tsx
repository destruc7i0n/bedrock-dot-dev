import { FunctionComponent, useEffect, useState } from 'react'

import Router from 'next/router'

import { compareBedrockVersions } from '../lib/util'

import { TagsResponse } from '../lib/files'
import { BedrockVersions } from '../lib/versions'

type VersionChooserProps = {
  versions: BedrockVersions
  tags: TagsResponse
}

const VersionChooser: FunctionComponent<VersionChooserProps> = ({ versions, tags }) => {
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
    setMinor(minorVersions[0])
  }, [major])

  const goTo = () => {
    Router.push('/docs/[...slug]', `/docs/${major}/${minor}/${file}`)
  }

  const setBeta = () => {
    setMajor(tags.beta[0])
    setMinor(tags.beta[1])
  }

  const setStable = () => {
    setMajor(tags.stable[0])
    setMinor(tags.stable[1])
  }

  return (
    <div className='d-flex flex-column'>
      <div className='d-flex flex-md-row flex-column align-items-center'>
        <select className='my-2 my-md-0' value={major} onChange={({ target: { value } }) => setMajor(value)}>
          {majorVersions.map((version) => <option key={`major-${version}`} value={version}>{version}</option>)}
        </select>
        <select className='mx-md-2 my-2 my-md-0' value={minor} onChange={({ target: { value } }) => setMinor(value)}>
          {minorVersions.map((version) => <option key={`minor-${version}`} value={version}>{version}</option>)}
        </select>
        <select className='mr-md-2 my-2 my-md-0' value={file} onChange={({ target: { value } }) => setFile(value)}>
          {files.map((file) => <option key={`file-${file}`} value={file}>{file}</option>)}
        </select>

        <div className='btn btn-sm btn-primary my-md-0' onClick={() => goTo()}>Go</div>
      </div>

      <div className='d-flex flex-row justify-content-around'>
        <button className='btn btn-primary mt-2' onClick={() => setBeta()}>Beta</button>
        <button className='btn btn-primary mt-2' onClick={() => setStable()}>Stable</button>
      </div>
    </div>
  )
}

export default VersionChooser
