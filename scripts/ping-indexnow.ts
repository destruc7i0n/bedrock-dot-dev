import "isomorphic-unfetch";

import fs from "fs";
import path from "path";

import { LIVE_URL } from "@lib/constants/env";
import { INDEXNOW_ENDPOINT, INDEXNOW_KEY } from "@lib/constants/indexnow";

// only the production deploy should announce urls
if (process.env.VERCEL_ENV !== "production") {
  console.log("indexnow not pinged");
  process.exit(0);
}

const main = async () => {
  const sitemapPath = path.resolve("public/sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    console.warn("no sitemap.xml, skipping indexnow");
    return;
  }

  const sitemap = fs.readFileSync(sitemapPath).toString();
  const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (!urlList.length) return;

  const { host } = new URL(LIVE_URL);

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${LIVE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  console.log(`indexnow: ${urlList.length} urls, ${res.status}`);
};

// a failed ping should never fail the build
main().catch((error) => console.warn("could not ping indexnow:", error));
