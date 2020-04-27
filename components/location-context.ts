import { createContext } from 'react'

type ContextType = {
  major: string
  minor: string
  file: string
}

const LocationContext = createContext<ContextType>({ major: '', minor: '', file: '' })

export default LocationContext
