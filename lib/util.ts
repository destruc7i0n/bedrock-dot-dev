import { BedrockVersions } from './versions';

export function compareBedrockVersions (a: string, b: string) {
  const sa = a.split('.')
  const sb = b.split('.')
  for (let i = 0; i < 4; i++) {
    const na = Number(sa[i])
    const nb = Number(sb[i])
    if (na > nb) return -1
    if (nb > na) return 1
  }
  return 0
}

export const getLink = (major: string, minor: string, file?: string) => `/docs/${major}/${minor}/${file}`

export const addHashIfNeeded = (s: string) => {
  return s[0] === '#' ? s : `#${s}`
}

export const removeHashIfNeeded = (s: string) => s.replace('#', '')

export type ParsedUrlResponse = {
  major: string
  minor: string
}

export const parseUrlQuery = (query: string, versions: BedrockVersions): ParsedUrlResponse => {
  const parts = query.split('/')

  let parsed: ParsedUrlResponse = { major: '', minor: '' }
  const [ major, minor ] = parts

  if (major && versions[major]) {
    parsed['major'] = parts[0]
    if (minor && versions[major][minor]) {
      parsed['minor'] = parts[1]
    }
  }

  return parsed
}
