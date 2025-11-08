import { RAW_GITHUB_URL } from "./constants";

import { getRepository, Locale } from "../i18n";

export function getErrorText(res: Response) {
  try {
    return res.text();
  } catch {
    return res.statusText;
  }
}

async function getError(res: Response): Promise<Error> {
  const errorText = await getErrorText(res);
  return new Error(`GitHub raw download error (${res.status}): ${errorText}`);
}

export const getRawFileFromGitHub = async (path: string): Promise<string> => {
  const url = RAW_GITHUB_URL + path;
  const res = await fetch(url);

  if (res.ok) return res.text();
  throw await getError(res);
};

export const getRawFileFromRepo = async (path: string, locale: Locale) => {
  const repo = getRepository(locale);
  return getRawFileFromGitHub(`/${repo.name}/${repo.tag}/${path}`);
};

export const getDocsFilesFromRepo = async (path: string, locale: Locale) => {
  return getRawFileFromRepo(path + ".html", locale);
};
