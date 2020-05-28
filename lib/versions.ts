import { listAllFiles } from './github/api'

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

  for (let treeItem of resp.tree) {
    if (treeItem.type === 'blob') {
      const pathParts = treeItem.path.split('/')
      if (pathParts.length > 1) { // [ major, minor, file ]
        let major: string, minor: string, file: string

        if (pathParts.length === 3) {
          [ major, minor, file ] = pathParts
        } else {
          [ major, file ] = pathParts
          minor = major
        }

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
  return formatTree(response)
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
    return  files
  }
}

export { formatTree, allFilesList }
