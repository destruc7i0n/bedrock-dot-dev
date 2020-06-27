import { allFilesList } from './versions'

export const getBedrockVersions = async () => {
  // console.log('Fetching all files...')
  return await allFilesList()
}
