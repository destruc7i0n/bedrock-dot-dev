import * as Log from "next/dist/build/output/log";

const devOnly = (fn: (...args: string[]) => void) =>
  process.env.NODE_ENV === "development" ? fn : () => null;

const logger = {
  info: devOnly(Log.info),
  error: Log.error,
  warn: devOnly(Log.warn),
};

export default logger;

export { green as logLinkColor } from "chalk";
