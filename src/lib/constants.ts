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

// Use PUBLIC_VERCEL_TARGET_ENV as per Vercel docs for Astro/Vite
// This indicates the target environment (production, preview, development, or custom)
const VERCEL_ENV =
  getEnvVar("PUBLIC_VERCEL_TARGET_ENV") ??
  getEnvVar("PUBLIC_VERCEL_ENV") ??
  getEnvVar("VERCEL_ENV") ??
  "development";

// Use PUBLIC_VERCEL_PROJECT_PRODUCTION_URL for production (always bedrock.dev)
// For preview builds, use PUBLIC_VERCEL_BRANCH_URL or PUBLIC_VERCEL_URL (actual preview URL)
// VERCEL_URL is server-side only (without protocol)
const isProduction = VERCEL_ENV === "production";
const VERCEL_URL_RAW = isProduction
  ? getEnvVar("PUBLIC_VERCEL_PROJECT_PRODUCTION_URL")
  : (getEnvVar("VERCEL_URL") ??
    getEnvVar("PUBLIC_VERCEL_BRANCH_URL") ??
    getEnvVar("PUBLIC_VERCEL_URL"));
const IS_VERCEL = Boolean(VERCEL_URL_RAW);

export const VERCEL_URL = IS_VERCEL ? `https://${VERCEL_URL_RAW}` : "";

export const LIVE_URL = IS_VERCEL
  ? VERCEL_ENV === "production"
    ? BEDROCK_DEV_URL
    : VERCEL_URL
  : BEDROCK_DEV_URL; // fallback to bedrock.dev if local

console.log(
  "VERCEL_ENV",
  VERCEL_ENV,
  "PUBLIC_VERCEL_TARGET_ENV",
  getEnvVar("PUBLIC_VERCEL_TARGET_ENV"),
  "PUBLIC_VERCEL_ENV",
  getEnvVar("PUBLIC_VERCEL_ENV"),
  "VERCEL_URL",
  getEnvVar("VERCEL_URL"),
  "PUBLIC_VERCEL_BRANCH_URL",
  getEnvVar("PUBLIC_VERCEL_BRANCH_URL"),
  "PUBLIC_VERCEL_URL",
  getEnvVar("PUBLIC_VERCEL_URL"),
  "PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",
  getEnvVar("PUBLIC_VERCEL_PROJECT_PRODUCTION_URL"),
  "VERCEL_URL_RAW",
  VERCEL_URL_RAW,
  "IS_VERCEL",
  IS_VERCEL,
  "VERCEL_URL (exported)",
  VERCEL_URL,
  "LIVE_URL",
  LIVE_URL,
);
