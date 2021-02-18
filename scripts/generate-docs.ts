// fetch polyfill
require('isomorphic-unfetch')

const path = require('path')
const fs = require('fs')

import { Locale } from '../lib/i18n'
import { BedrockVersionsFile, getFormattedFilesList } from '../lib/versions'

const main = async () => {
  let file: BedrockVersionsFile = {}
  for (let locale of Object.values(Locale)) {
    file[locale] = await getFormattedFilesList(locale)
  }

  const dir = path.resolve('public/static/docs.json')

  if (!fs.existsSync('public/static')) fs.mkdirSync('public/static')

  fs.writeFileSync(dir, JSON.stringify(file))
  console.log('static docs file generated!')
}

main()
