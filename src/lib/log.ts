const devOnly = (fn: (...args: unknown[]) => void) =>
  process.env.NODE_ENV === "development" ? fn : () => null;

const logger = {
  info: devOnly((...args: unknown[]) => console.log(...args)),
  error: (...args: unknown[]) => console.error(...args),
  warn: devOnly((...args: unknown[]) => console.warn(...args)),
};

export default logger;

// Simple color function for terminal output (no dependencies)
export const logLinkColor = (text: string): string => {
  if (process.env.NODE_ENV === "development" && typeof process !== "undefined" && process.stdout?.isTTY) {
    // ANSI color code for green
    return `\x1b[32m${text}\x1b[0m`;
  }
  return text;
};

