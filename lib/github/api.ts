import { GITHUB_API_URL } from './constants'

import { getErrorText } from './raw'
import { getRepository, Locale } from '../i18n'

export interface GitHubTreeResponse {
  tree: {
    path: string
    type: 'tree' | 'blob'
    url: string
  }[]
}

export interface GithubReleasePartial {
  tag_name: string
  name: string
  published_at: string
  html_url: string
}

async function getError(res: Response): Promise<Error> {
  const errorText = await getErrorText(res)
  return new Error(`GitHub api error (${res.status}): ${errorText}`)
}

// use the recursive api to list all the files in the repo
export async function listAllFilesFromRepo (locale: Locale): Promise<GitHubTreeResponse | Error> {
  const repo = getRepository(locale)
  // https://api.github.com/repos/bedrock-dot-dev/docs/git/trees/master?recursive=1
  const res = await fetch(`${GITHUB_API_URL}/repos/${repo.name}/git/trees/${repo.tag}?recursive=1`)

  if (res.ok) return res.json()
  return getError(res)
}

// list all releases from the repo from all time, paginating if necessary
export async function listReleases (repo: string): Promise<GithubReleasePartial[]> {
  let releases: GithubReleasePartial[] = []
  let page = 1

  while (true) {
    // https://api.github.com/repos/bedrock-dot-dev/docs/releases?page=1
    const res = await fetch(`${GITHUB_API_URL}/repos/${repo}/releases?page=${page}&per_page=100`)

    if (res.ok) {
      const json = await res.json()
      if (json.length === 0) break
      releases = [...releases, ...json]
      page++
    } else {
      return []
    }
  }

  return releases
}
