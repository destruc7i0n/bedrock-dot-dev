import { BedrockVersions } from './versions'
import { Tags, TagsResponse } from './tags'

export function compareBedrockVersions (a: string, b: string) {
  const sa = getVersionParts(a)
  const sb = getVersionParts(b)
  for (let i = 0; i < 4; i++) {
    const na = sa[i]
    const nb = sb[i]
    if (na > nb) return -1
    if (nb > na) return 1
  }
  return 0
}

export const getLink = (major: string, minor: string, file: string, tags: TagsResponse, replaceWithTagged: boolean = true) => {
  file = encodeURI(file)
  if (replaceWithTagged) {
    let version = [major, minor]
    if (areVersionsEqual(version, tags[Tags.Stable])) return `/docs/stable/${file}`
    if (areVersionsEqual(version, tags[Tags.Beta])) return `/docs/beta/${file}`
  }
  return `/docs/${major}/${minor}/${file}`
}

export const getMinorVersionTitle = (version: string[], tags: TagsResponse, t: (a: string) => string) => {
  let title = version[1]
  if (areVersionsEqual(version, tags[Tags.Beta])) title += ` (${t('component.version_chooser.beta_string')})`
  if (areVersionsEqual(version, tags[Tags.Stable])) title += ` (${t('component.version_chooser.stable_string')})`
  return title
}

export const addHashIfNeeded = (s: string) => {
  return s[0] === '#' ? s : `#${s}`
}

export const removeHashIfNeeded = (s: string) => s.replace('#', '')

export const areVersionsEqual = (a: string[], b: string[]) => a[0] === b[0] && a[1] === b[1]

export const getVersionParts = (version: string): number[] => version.split('.').map(Number)

export const getTagFromSlug = (slug: string | string[] | undefined) => {
  if (typeof slug === 'object' && slug.length === 2) {
    if (['stable', 'beta'].includes(slug[0])) {
      if (slug[0] === 'stable') return Tags.Stable
      else if (slug[0] === 'beta') return Tags.Beta
    }
  }
  return null
}

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

export const updateFileNames = (fileName: string): string => {
  switch (fileName) {
    case 'MoLang': return 'Molang'
    default: return fileName
  }
}

export const isVersionSince = (version: string, since: string) => {
  return compareBedrockVersions(since, version) >= 0
}

export const isVersionBefore = (version: string, before: string) => {
  return compareBedrockVersions(before, version) < 0
}

export const isNewMolangFilename = (version: string): boolean => {
  // check if version is newer than the one Mojang changed the MoLang to Molang
  return isVersionSince(version, '1.17.30.24')
}

export const oneLine = (str: string) => str.split(/\r?\n/).map(e => e.trim()).join('')
