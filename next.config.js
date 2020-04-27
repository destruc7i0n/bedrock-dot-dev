const fetch = require('node-fetch')

const getTags = async () => {
  // fetch the tags from the server
  const tags = await fetch('https://raw.githubusercontent.com/bedrock-dot-dev/docs/master/tags.json')
  return await tags.json()
}

module.exports = {
  typescript: {
    ignoreDevErrors: true
  },
  experimental: {
    modern: true,
    async redirects () {
      const { stable, beta } = await getTags()

      return [
        {
          source: '/docs{/}?',
          destination: '/',
          permanent: false
        },
        {
          source: '/r/:file',
          destination: `/docs/${stable.join('/')}/:file`,
          permanent: false
        },
        {
          source: '/b/:file',
          destination: `/docs/${beta.join('/')}/:file`,
          permanent: false
        },
      ]
    }
  }
}
