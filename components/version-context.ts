import { createContext } from 'react'

import { BedrockVersions } from 'lib/versions'
import { Tags, TagsResponse } from 'lib/tags'

type ContextType = {
  major: string
  minor: string
  file: string
  versions: BedrockVersions
  tags: TagsResponse
}

// the context for which versions there are
const VersionContext = createContext<ContextType>({
  major: '', minor: '', file: '', versions: {},
  tags: { [Tags.Stable]: [], [Tags.Beta]: [] }
})

export default VersionContext
export const VersionContextProvider = VersionContext.Provider
