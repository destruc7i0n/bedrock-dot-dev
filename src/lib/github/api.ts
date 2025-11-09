import { GITHUB_API_URL } from "./constants";

export interface GithubReleasePartial {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
}

// list all releases from the repo from all time, paginating if necessary
export async function listReleases(
  repo: string,
): Promise<GithubReleasePartial[]> {
  let releases: GithubReleasePartial[] = [];
  let page = 1;

  while (true) {
    // https://api.github.com/repos/bedrock-dot-dev/docs/releases?page=1
    const res = await fetch(
      `${GITHUB_API_URL}/repos/${repo}/releases?page=${page}&per_page=100`,
    );

    if (res.ok) {
      const json = await res.json();
      if (json.length === 0) break;
      releases = [...releases, ...json];
      page++;
    } else {
      return [];
    }
  }

  return releases;
}
