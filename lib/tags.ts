import { RAW_GITHUB_URL } from './github/constants'

import { getRepository, Locale } from './i18n'

export enum Tags {
  Stable = 'stable',
  Beta = 'beta'
}

export type TagsResponse = {
  [tag in Tags]: string[]
}
// fetch the tags file from the repository
export const getTags = async (locale: Locale): Promise<TagsResponse> => {
  // fetch the tags from the server
  const repo = getRepository(locale)
  const tags = await fetch(`${RAW_GITHUB_URL}/${repo.name}/${repo.tag}/tags.json`)
  return await tags.json()
}
