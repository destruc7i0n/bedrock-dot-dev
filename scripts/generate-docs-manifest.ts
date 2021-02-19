// fetch polyfill
require('isomorphic-unfetch')

const path = require('path')
const fs = require('fs')

import { getVersionsFile } from '../lib/versions'

const main = async () => {
  const file = await getVersionsFile()

  if (!fs.existsSync('public/static')) fs.mkdirSync('public/static')

  const dir = path.resolve('public/static/docs.json')

  fs.writeFileSync(dir, JSON.stringify(file))
  console.log('static docs file generated!')
}

main()
