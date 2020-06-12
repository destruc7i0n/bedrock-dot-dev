import { allFilesList } from './versions'

import { RAW_GITHUB_URL, REPO_NAME, REPO_TAG } from './github/constants'

export const getBedrockVersions = async () => {
  // console.log('Fetching all files...')
  return await allFilesList()
}

export interface TagsResponse {
  stable: string[]
  beta: string[]
}

// fetch the tags file from the repository
export const getTags = async (): Promise<TagsResponse> => {
  // fetch the tags from the server
  const tags = await fetch(`${RAW_GITHUB_URL}/${REPO_NAME}/${REPO_TAG}/tags.json`)
  return await tags.json()
}
