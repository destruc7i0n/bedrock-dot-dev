// fetch polyfill
require('isomorphic-unfetch')

const path = require('path')
const fs = require('fs')

import { getFormattedFilesList } from '../lib/versions'

const main = async () => {
  const docs = await getFormattedFilesList()

  const dir = path.resolve('public/static/docs.json')

  if (!fs.existsSync('public/static')) fs.mkdirSync('public/static')

  fs.writeFileSync(dir, JSON.stringify(docs))
  console.log('static docs file generated!')
}

main()
