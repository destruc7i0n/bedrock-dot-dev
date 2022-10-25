// fetch polyfill
require('isomorphic-unfetch')

const path = require('path')
const fs = require('fs')

import { Locale } from '../lib/i18n'
import { getTags } from '../lib/tags'
import { getVersionsFile } from '../lib/versions'

const main = async () => {
  const file = await getVersionsFile()
  const tags = await getTags(Locale.English, true)

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

  const docsFile = path.resolve('public/static/docs.json')
  const tagsFile = path.resolve('public/static/tags.json')

  fs.writeFileSync(docsFile, JSON.stringify(file))
  fs.writeFileSync(tagsFile, JSON.stringify(tags))
  console.log('static docs file generated!')
}

main()
