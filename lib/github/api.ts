import { GITHUB_API_URL, REPO_NAME } from './constants'

import { getErrorText } from './raw'

async function getError(res: Response): Promise<Error> {
  const errorText = await getErrorText(res)
  return new Error(`GitHub api error (${res.status}): ${errorText}`)
}

// use the recursive api to lsit all the files in the repo
export const listAllFiles = async () => {
  // https://api.github.com/repos/bedrock-dot-dev/docs/git/trees/master?recursive=1
  const res = await fetch(GITHUB_API_URL + '/repos/' + REPO_NAME + '/git/trees/master?recursive=1')

  if (res.ok) return res.json()
  return getError(res)
}
