import * as Log from 'next/dist/build/output/log'

const wrap = (fn: (...args: string[]) => void) => process.env.NODE_ENV === 'development'
  ? fn
  : () => null

export default {
  info: wrap(Log.info),
  error: wrap(Log.error),
  warn: wrap(Log.warn),
}

export { green as logLinkColor } from 'chalk'
