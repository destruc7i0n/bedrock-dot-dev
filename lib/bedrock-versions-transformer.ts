import { BedrockVersions } from './versions'
import { compareBedrockVersions } from './util';

export interface TransformedOutbound {
  key: string[]
  versions: [
    number[], // the minecraft version
    number[] // the files
  ][]
}

const transformInbound = (data: TransformedOutbound) => {
  let versions: BedrockVersions = {}

  for (let version of data.versions) {
    const major = [ version[0][0], version[0][1], 0, 0 ].join('.')
    const minor = version[0].join('.')

    if (!versions[major]) versions[major] = {}
    if (!versions[major][minor]) versions[major][minor] = []

    versions[major][minor] = version[1].map((i) => data.key[i])
  }

  return versions
}

// transform versions to
// [ [ ...minecraft version... ], [ ...file indices... ] ]
const transformOutbound = (data: BedrockVersions) => {
  const out: TransformedOutbound = { key: [], versions: [] }

  const majorVersions = Object.keys(data).sort(compareBedrockVersions)

  for (let major of majorVersions) {
    const minorVersions = Object.keys(data[major]).sort(compareBedrockVersions)

    for (let minor of minorVersions) {
      const version = minor.split('.').map(Number)

      let map = []
      for (let file of data[major][minor]) {
        if (!out.key.includes(file)) out.key.push(file)
        map.push(out.key.indexOf(file))
      }

      out.versions.push([
        version,
        map
      ])
    }
  }

  return out
}

export { transformInbound, transformOutbound }
