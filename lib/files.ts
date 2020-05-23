import { allFilesList, BedrockVersions } from './versions'

export const getBedrockVersions = async (): Promise<BedrockVersions>  => {
  // console.log('Fetching all files...')
  return await allFilesList()
}

export interface TagsResponse {
  stable: string[]
  beta: string[]
}

export const getTags = async (): Promise<TagsResponse> => {
  // fetch the tags from the server
  const tags = await fetch('https://raw.githubusercontent.com/bedrock-dot-dev/docs/master/tags.json')
  return await tags.json()
}
