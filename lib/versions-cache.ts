import fs from 'fs'
import { join, resolve } from 'path'

import * as flatCache from 'flat-cache'
import { BedrockVersions } from './versions'

// use tmp on production
const cacheDirectory = process.env.NODE_ENV === 'production' ? join('/tmp', '.cache') : ''

const checkHardFile = () => {
  const docsFile = resolve('public/docs.json')
  if (fs.existsSync(docsFile)) {
    const textContent = fs.readFileSync(docsFile).toString()
    if (textContent) return JSON.parse(textContent)
  }
}

// store ratelimited call as a file and fetch when needed
const checkCache = (): BedrockVersions | undefined => {
  // get from the hard file in production to not use the api
  if (process.env.NODE_ENV === 'production') {
    const hardFile: BedrockVersions = checkHardFile()
    if (hardFile) return hardFile
  }

  const cache = flatCache.create('versions', cacheDirectory)
  const timestamp = cache.getKey('timestamp')
  if (!timestamp) {
    return
  } else {
    const cachedTime = new Date(timestamp)
    const currentTime = new Date()
    // difference in mins
    const difference = Math.round((currentTime.getTime() - cachedTime.getTime()) / 60000)

    const files: BedrockVersions = cache.getKey('files')
    // update every 10 min
    if (difference < 10 && files) return files
  }
}

const setCache = (files: BedrockVersions) => {
  const cache = flatCache.create('versions', cacheDirectory)
  cache.setKey('timestamp', new Date().getTime())
  cache.setKey('files', files)
  cache.save()
}

export { setCache, checkCache }
