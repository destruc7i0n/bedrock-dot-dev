const BEDROCK_DEV_URL = "https://bedrock.dev";

// Support both Astro (import.meta.env) and Node.js (process.env) contexts
// Vercel always provides these variables, so we just need to check the context
const getEnvVar = (name: string): string | undefined => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const env = import.meta.env as Record<string, string | undefined>;
    return env[name];
  }
  if (typeof process !== "undefined" && process.env) {
    return process.env[name];
  }
  return undefined;
};

const VERCEL_ENV = getEnvVar("PUBLIC_VERCEL_ENV") ?? "development";
const PUBLIC_VERCEL_URL = getEnvVar("PUBLIC_VERCEL_PROJECT_PRODUCTION_URL");
const IS_VERCEL = Boolean(PUBLIC_VERCEL_URL);

export const VERCEL_URL = IS_VERCEL ? `https://${PUBLIC_VERCEL_URL}` : "";

export const LIVE_URL = IS_VERCEL
  ? VERCEL_ENV === "production"
    ? BEDROCK_DEV_URL
    : VERCEL_URL
  : BEDROCK_DEV_URL; // fallback to bedrock.dev if local

console.log(
  "VERCEL_ENV",
  VERCEL_ENV,
  "PUBLIC_VERCEL_URL",
  PUBLIC_VERCEL_URL,
  "IS_VERCEL",
  IS_VERCEL,
  "VERCEL_URL",
  VERCEL_URL,
  "LIVE_URL",
  LIVE_URL,
);
