export const GITHUB_URL = 'https://github.com'

export const GITHUB_API_URL = 'https://api.github.com'

export const RAW_GITHUB_URL = 'https://raw.githubusercontent.com'

export const REPO_NAME = 'bedrock-dot-dev/docs'

// use the github sha if possible
export const REPO_TAG = process.env.VERCEL_GITHUB_COMMIT_SHA || 'master'
