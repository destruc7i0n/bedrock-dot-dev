export function getOgImageUrl(params?: {
  file?: string;
  version?: string;
}): string {
  const baseUrl = import.meta.env.PROD
    ? import.meta.env.SITE
    : "http://localhost:4321";

  const url = new URL("/api/og.png", baseUrl);

  if (params?.file) {
    url.searchParams.set("file", params.file);
  }

  if (params?.version) {
    url.searchParams.set("version", params.version);
  }

  return url.href;
}
