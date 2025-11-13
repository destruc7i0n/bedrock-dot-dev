import "isomorphic-unfetch";

import path from "path";
import fs from "fs";

import { SitemapStream, streamToPromise } from "sitemap";

import { LIVE_URL } from "../src/lib/constants";
import { getTags } from "../src/lib/tags";
import { Tag } from "../src/lib/types";
import { Locale, getLocale } from "../src/lib/i18n";

if (!process.env.VERCEL_GITHUB_DEPLOYMENT && process.platform !== "darwin") {
  console.log("sitemap.xml not generated");
  process.exit(0);
}

const main = async () => {
  const stream = new SitemapStream({ hostname: LIVE_URL });

  stream.write({
    url: "/",
    changefreq: "weekly",
    priority: 0.8,
  });

  const staticFilePath = path.resolve("public/static/docs.json");
  const staticFileContents = JSON.parse(
    fs.readFileSync(staticFilePath).toString(),
  );
  const versions = staticFileContents["versions"];

  const langs = Object.keys(staticFileContents["versions"]);

  for (const lang of langs) {
    const locale = getLocale(lang);
    const tags = await getTags(locale);
    const langVersions = versions[lang];

    for (const tag of Object.keys(tags)) {
      const [major, minor] = tags[tag as Tag];
      if (!langVersions[major] || !langVersions[major][minor]) {
        console.warn(
          `Warning: Version ${major}.${minor} not found in docs.json for language ${lang}, skipping`,
        );
        continue;
      }
      const files = langVersions[major][minor];
      for (const file of files) {
        const prefix = locale === Locale.English ? "" : `/${locale}`;
        stream.write({
          url: `${prefix}/docs/${tag}/${file}`,
          changefreq: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  stream.end();

  const sitemap = (await streamToPromise(stream)).toString();
  fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemap);

  console.log(`sitemap.xml generated!`);
};

main();
