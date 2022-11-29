export const VERCEL_URL = !!process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : ''
// export const LIVE_URL_PREFIX = process.env?.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'https://bedrock.dev' : VERCEL_URL
