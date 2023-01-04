import * as Log from "next/dist/build/output/log";

const devOnly = (fn: (...args: string[]) => void) =>
  process.env.NODE_ENV === "development" ? fn : () => null;

export default {
  info: devOnly(Log.info),
  error: Log.error,
  warn: devOnly(Log.warn),
};

export { green as logLinkColor } from "chalk";
