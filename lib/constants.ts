const IS_VERCEL = !!process.env.NEXT_PUBLIC_VERCEL_URL;
const BEDROCK_DEV_URL = "https://bedrock.dev";

export const VERCEL_URL = IS_VERCEL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "";

export const LIVE_URL = IS_VERCEL
  ? process.env?.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? BEDROCK_DEV_URL
    : VERCEL_URL
  : BEDROCK_DEV_URL; // fallback to bedrock.dev if local
