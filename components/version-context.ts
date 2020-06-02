import { createContext } from 'react'

import { BedrockVersions } from 'lib/versions'

type ContextType = {
  major: string
  minor: string
  file: string
  versions: BedrockVersions
}

// the context for which versions there are
const VersionContext = createContext<ContextType>({ major: '', minor: '', file: '', versions: {} })

export default VersionContext
