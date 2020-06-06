const path = require('path')
const fs = require('fs')

const sitemap = require('nextjs-sitemap-generator')

if (!process.env.VERCEL_GITHUB_DEPLOYMENT) {
  console.log('sitemap.xml not generated')
  process.exit(0)
}

const BUILD_ID = fs.readFileSync('.next/BUILD_ID').toString()

const SERVERLESS_DIR = '../.next/serverless/'
const STATIC_DIR = path.join('../.next/server/static/', BUILD_ID)

const nextPagesPath = process.env.VERCEL_GITHUB_DEPLOYMENT
  ? SERVERLESS_DIR
  : STATIC_DIR

sitemap({
  baseUrl: 'https://bedrock.dev',
  pagesDirectory: path.join(__dirname, nextPagesPath, '/pages'),
  targetDirectory : 'public/',
  ignoredPaths: ['[fallback]', 'api'],
})

console.log(`sitemap.xml generated!`)

