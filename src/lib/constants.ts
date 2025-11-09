const BEDROCK_DEV_URL = "https://bedrock.dev";

// Support both Astro (import.meta.env) and Vercel (process.env) environment variables
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

const VERCEL_ENV =
  getEnvVar("VERCEL_ENV") ??
  getEnvVar("NEXT_PUBLIC_VERCEL_ENV") ??
  "development";
const PUBLIC_VERCEL_URL =
  getEnvVar("VERCEL_URL") ?? getEnvVar("NEXT_PUBLIC_VERCEL_URL");
const IS_VERCEL = Boolean(PUBLIC_VERCEL_URL);

export const VERCEL_URL = IS_VERCEL ? `https://${PUBLIC_VERCEL_URL}` : "";

export const LIVE_URL = IS_VERCEL
  ? VERCEL_ENV === "production"
    ? BEDROCK_DEV_URL
    : VERCEL_URL
  : BEDROCK_DEV_URL; // fallback to bedrock.dev if local
