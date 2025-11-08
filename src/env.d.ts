/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly AWS_ACCESS_KEY_ID_BEDROCK?: string;
  readonly AWS_SECRET_ACCESS_KEY_BEDROCK?: string;
  readonly AWS_BUCKET_NAME_BEDROCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}