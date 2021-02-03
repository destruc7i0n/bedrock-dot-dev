const path = require('path')

module.exports = {
  localePath: (process.env.VERCEL && !process.env.CI) ? path.resolve('./locales') : path.resolve('./public/locales'),
}
