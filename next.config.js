const getTags = async () => {
  // fetch the tags from the server
  const tags = await fetch('https://raw.githubusercontent.com/bedrock-dot-dev/docs/master/tags.json')
  return await tags.json()
}

module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreDevErrors: true,
  },
  experimental: {
    modern: true,
    async redirects () {
      const { stable, beta } = await getTags()

      const version = '\\d+\\.\\d+\\.\\d+\\.\\d+'

      return [
        {
          source: '/docs{/}?',
          destination: '/',
          permanent: false,
        },
        {
          source: `/{docs/}?:path((?:${version})\\/?(?:(?:${version})\\/?)?)`,
          destination: '/?r=:path',
          permanent: false
        },
        // redirect to latest stable
        {
          source: '/(r|c)/:file',
          destination: `/docs/${stable.join('/')}/:file`,
          permanent: false,
        },
        {
          source: '/(r|c){/}?',
          destination: `/?r=${stable.join('/')}`,
          permanent: false,
        },
        // redirect to latest beta
        {
          source: '/b/:file',
          destination: `/docs/${beta.join('/')}/:file`,
          permanent: false,
        },
        {
          source: '/b{/}?',
          destination: `/?r=${beta.join('/')}`,
          permanent: false,
        },
        {
          // match version numbers, old routing
          source: `/:major(${version})/:minor(${version})/:file.:ext?`,
          destination: `/docs/:major/:minor/:file`,
          permanent: true,
        },
      ]
    }
  }
}
