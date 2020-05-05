const fetch = require('node-fetch')

const getTags = async () => {
  // fetch the tags from the server
  const tags = await fetch('https://raw.githubusercontent.com/bedrock-dot-dev/docs/master/tags.json')
  return await tags.json()
}

module.exports = {
  typescript: {
    ignoreDevErrors: true,
    // reactRefresh: true,
  },
  experimental: {
    modern: true,
    async redirects () {
      const { stable, beta } = await getTags()

      return [
        {
          source: '/docs{/}?',
          destination: '/',
          permanent: false,
        },
        {
          source: '/r/:file',
          destination: `/docs/${stable.join('/')}/:file`,
          permanent: false,
        },
        {
          source: '/b/:file',
          destination: `/docs/${beta.join('/')}/:file`,
          permanent: false,
        },
        {
          // match version numbers
          source: '/:major(\\d+\\.\\d+\\.\\d+\\.\\d+)/:minor(\\d+\\.\\d+\\.\\d+\\.\\d+)/:file',
          destination: `/docs/:major/:minor/:file`,
          permanent: false,
        },
      ]
    }
  }
}
