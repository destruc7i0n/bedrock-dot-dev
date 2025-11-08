const BEDROCK_DEV_URL = "https://bedrock.dev";

const VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development";
const PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
const IS_VERCEL = Boolean(PUBLIC_VERCEL_URL);

export const VERCEL_URL = IS_VERCEL ? `https://${PUBLIC_VERCEL_URL}` : "";

export const LIVE_URL = IS_VERCEL
  ? VERCEL_ENV === "production"
    ? BEDROCK_DEV_URL
    : VERCEL_URL
  : BEDROCK_DEV_URL; // fallback to bedrock.dev if local
