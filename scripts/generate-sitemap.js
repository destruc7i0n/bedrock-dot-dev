require('isomorphic-unfetch')

const path = require('path')
const fs = require('fs')

const { SitemapStream, streamToPromise } = require('sitemap')

const getTags = require('./lib/tags')

if (!process.env.VERCEL_GITHUB_DEPLOYMENT && process.platform !== 'darwin') {
  console.log('sitemap.xml not generated')
  process.exit(0)
}

const main = async () => {
  const stream = new SitemapStream( { hostname: 'https://bedrock.dev' } )

  stream.write({
    url: '/',
    changefreq: 'weekly',
    priority: 0.8,
  })

  const staticFilePath = path.resolve('public/static/docs.json')
  const versions = JSON.parse(fs.readFileSync(staticFilePath).toString())
  const tags = await getTags()

  for (let tag of Object.keys(tags)) {
    const [ major, minor ] = tags[tag]
    const files = versions[major][minor]
    for (let file of files) {
      stream.write({
        url: `/docs/${tag}/${file}`,
        changefreq: 'weekly',
        priority: 0.8,
      })
    }
  }
  stream.end()

  const sitemap = (await streamToPromise(stream)).toString()
  fs.writeFileSync(path.resolve('public/sitemap.xml'), sitemap)

  console.log(`sitemap.xml generated!`)
}

main()

