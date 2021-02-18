import { RAW_GITHUB_URL, REPO_NAME, REPO_TAG } from './github/constants'

export enum Tags {
  Stable = 'stable',
  Beta = 'beta'
}

export type TagsResponse = {
  [tag in Tags]: string[]
}
// fetch the tags file from the repository
export const getTags = async (locale: string): Promise<TagsResponse> => {
  // fetch the tags from the server
  const tags = await fetch(`${RAW_GITHUB_URL}/${REPO_NAME}/${REPO_TAG}/tags.json`)
  return await tags.json()
}
