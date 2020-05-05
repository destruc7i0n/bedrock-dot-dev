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

const allFilesList = async () => {
  const check = checkCache()
  if (check) return check
  else {
    const response = await listAllFiles()
    const files = formatTree(response)
    setCache(files)
    return  files
  }
}

export { formatTree, allFilesList }
