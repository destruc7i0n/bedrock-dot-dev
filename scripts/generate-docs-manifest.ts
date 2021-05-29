// fetch polyfill
require('isomorphic-unfetch')

const path = require('path')
const fs = require('fs')

import { getVersionsFile } from '../lib/versions'

const main = async () => {
  const file = await getVersionsFile()

  // count the number of documentation files per locale
  for (let [locale, versions] of Object.entries(file['versions'])) {
    let count = 0
    for (let [, minorVersions] of Object.entries(versions)) {
      // sum the number of files per version
      count += Object.values(minorVersions).reduce((acc, files) => acc + files.length, 0)
    }
    console.log(`found ${count} ${locale.toUpperCase()} documentation files`)
  }

  if (!fs.existsSync('public/static')) fs.mkdirSync('public/static')

  const dir = path.resolve('public/static/docs.json')

  fs.writeFileSync(dir, JSON.stringify(file))
  console.log('static docs file generated!')
}

main()
