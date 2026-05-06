/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly SITE?: string;
  readonly R2_ACCESS_KEY_ID_BEDROCK?: string;
  readonly R2_SECRET_ACCESS_KEY_BEDROCK?: string;
  readonly R2_BUCKET_NAME_BEDROCK?: string;
  readonly R2_ENDPOINT_BEDROCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
