import { listAllFiles } from './github/api'

import Log from './log'

import { checkCache, setCache } from './versions-cache'

interface GitHubTreeResponse {
  tree: {
    path: string
    type: 'tree' | 'blob'
    url: string
  }[]
}

export interface BedrockVersions {
  [key: string]: {
    [key: string]: string[]
  }
}

function formatTree (resp: GitHubTreeResponse): BedrockVersions {
  let versions: BedrockVersions = {}

  // convert the recursive output to one that follows `BedrockVersions` format
  for (let treeItem of resp.tree) {
    if (treeItem.type === 'blob') {
      // ignore any non html files
      if (!treeItem.path.endsWith('.html')) continue

      const pathParts = treeItem.path.split('/')
      if (pathParts.length > 1) { // [ major, minor, file ]
        let major: string, minor: string, file: string

        if (pathParts.length === 3) {
          [ major, minor, file ] = pathParts
        } else {
          // if 1.8, set to the same version
          [ major, file ] = pathParts
          minor = major
        }

        // initialize the objects
        if (!versions[major]) versions[major] = {}
        if (!versions[major][minor]) versions[major][minor] = []

        let docName = file.replace('.html', '')

        versions[major][minor].push(docName)
      }
    }
  }

  return versions
}

const getFormattedFilesList = async () => {
  const response = await listAllFiles()
  if (response) return formatTree(response)
  else {
    Log.error('Could not list all files!', response)
    return {}
  }
}

const allFilesList = async () => {
  // only use local cache in dev
  const check = checkCache()
  if (check) {
    // console.log('Using local cache for files list')
    return check
  }
  else {
    // console.log('Fetching files list')
    const files = await getFormattedFilesList()
    setCache(files)
    return files
  }
}

export { formatTree, allFilesList, getFormattedFilesList }
