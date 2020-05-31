const path = require('path')
const fs = require('fs')

const sitemap = require('nextjs-sitemap-generator')

const BUILD_ID = fs.readFileSync('.next/BUILD_ID').toString()

const nextPagesPath = process.env.VERCEL_GITHUB_DEPLOYMENT
  ? '../.next/serverless/'
  : path.join('../.next/server/static/', BUILD_ID)

sitemap({
  baseUrl: 'https://bedrock.dev',
  pagesDirectory: path.join(__dirname, nextPagesPath, '/pages'),
  targetDirectory : 'public/',
  ignoredPaths: ['[fallback]', 'api'],
})

console.log(`sitemap.xml generated!`);

