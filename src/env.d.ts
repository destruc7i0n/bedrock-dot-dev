/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SITE?: string;
  readonly ASSETS_PREFIX?: string;
  readonly AWS_ACCESS_KEY_ID_BEDROCK?: string;
  readonly AWS_SECRET_ACCESS_KEY_BEDROCK?: string;
  readonly AWS_BUCKET_NAME_BEDROCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}