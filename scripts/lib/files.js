const fs = require('fs')

const getValidFiles = () => {
  let files = []
  let versions = {}
  try {
    versions = JSON.parse(fs.readFileSync('./public/static/docs.json').toString())
  } catch (e) {
    return  files
  }

  // get the latest version (incl. beta)
  const versionsSorted = Object.keys(versions).sort((a, b) => a.split('.')[1] - b.split('.')[1])
  const maxVersion = versionsSorted[versionsSorted.length - 1]

  // get all the possible files for the version
  files = Object.keys(versions[maxVersion]).reduce((acc, minor) =>
    acc.concat(versions[maxVersion][minor].filter(file => !acc.includes(file))), [])

  return files
}

module.exports = { getValidFiles }
