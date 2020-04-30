import { createContext } from 'react'

import { BedrockVersions } from '../pages/api/docs/list'

type ContextType = {
  major: string
  minor: string
  file: string
  versions: BedrockVersions
}

const VersionContext = createContext<ContextType>({ major: '', minor: '', file: '', versions: {} })

export default VersionContext
