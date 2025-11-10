const BEDROCK_DEV_URL = "https://bedrock.dev";

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

// vercel env vars are confusing...
const VERCEL_ENV =
  getEnvVar("PUBLIC_VERCEL_TARGET_ENV") ??
  getEnvVar("PUBLIC_VERCEL_ENV") ??
  getEnvVar("VERCEL_ENV") ??
  "development";

const VERCEL_URL_RAW =
  VERCEL_ENV === "production"
    ? getEnvVar("PUBLIC_VERCEL_PROJECT_PRODUCTION_URL")
    : (getEnvVar("VERCEL_URL") ??
      getEnvVar("PUBLIC_VERCEL_URL") ??
      getEnvVar("PUBLIC_VERCEL_BRANCH_URL"));

export const VERCEL_URL = VERCEL_URL_RAW ? `https://${VERCEL_URL_RAW}` : "";

export const LIVE_URL =
  VERCEL_ENV === "production" ? BEDROCK_DEV_URL : VERCEL_URL || BEDROCK_DEV_URL;
