const getTags = require('./scripts/lib/tags')

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
          source: '/(r|c|s)/:file',
          destination: `/docs/stable/:file`,
          permanent: false,
        },
        {
          source: '/(r|c|s){/}?',
          destination: `/?r=${stable.join('/')}`,
          permanent: false,
        },
        // redirect to latest beta
        {
          source: '/b/:file',
          destination: `/docs/beta/:file`,
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
  },
  webpack (config, options) {
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: options.isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      )
    }
    return config
  },
}
