import { LIVE_URL } from "./constants";

export function getOgImageUrl(params?: {
  file?: string;
  version?: string;
}): string {
  const baseUrl = import.meta.env.DEV ? "http://localhost:4321" : LIVE_URL;

  const url = new URL("/api/og.png", baseUrl);

  if (params?.file) {
    url.searchParams.set("file", params.file);
  }

  if (params?.version) {
    url.searchParams.set("version", params.version);
  }

  return url.href;
}
