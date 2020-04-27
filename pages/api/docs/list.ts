import { NextApiRequest, NextApiResponse } from 'next'

import { listAllFiles } from '../../../lib/github/api'

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

export default async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    let response = await listAllFiles()
    const files = formatTree(response)

    res.status(200).json({
      files
    })
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}
