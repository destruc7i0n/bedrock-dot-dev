const devOnly = (fn: (...args: unknown[]) => void) =>
  process.env.NODE_ENV === "development" ? fn : () => null;

const logger = {
  info: devOnly((...args: unknown[]) => console.log(...args)),
  error: (...args: unknown[]) => console.error(...args),
  warn: devOnly((...args: unknown[]) => console.warn(...args)),
};

export default logger;
