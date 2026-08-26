import "isomorphic-unfetch";

import fs from "fs";
import path from "path";

import { SitemapStream, streamToPromise } from "sitemap";

import { LIVE_URL } from "@lib/constants/env";
import { getLastModified, lastModifiedFor } from "@lib/docs/lastmod";
import { getTaggedFiles } from "@lib/docs/tagged";
import { Locale } from "@lib/i18n";
import { docPath } from "@lib/markdown";

if (!process.env.VERCEL_GITHUB_DEPLOYMENT && process.platform !== "darwin") {
  console.log("sitemap.xml not generated");
  process.exit(0);
}

const main = async () => {
  const stream = new SitemapStream({ hostname: LIVE_URL });

  stream.write({ url: "/", changefreq: "weekly", priority: 0.8 });
  stream.write({ url: "/packs", changefreq: "weekly", priority: 0.5 });

  const tagged = await getTaggedFiles(Locale.English);
  const dates = getLastModified();

  for (const [tag, { major, minor, files }] of Object.entries(tagged)) {
    for (const file of files) {
      stream.write({
        url: docPath(tag, file),
        changefreq: "weekly",
        priority: 0.8,
        lastmod: lastModifiedFor(dates, major, minor, file),
      });
    }
  }

  stream.end();

  const sitemap = (await streamToPromise(stream)).toString();
  fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemap);

  console.log(`sitemap.xml generated!`);
};

main();
