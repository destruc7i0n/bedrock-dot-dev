import { join, resolve } from "path";
import * as fs from "fs";

import * as flatCache from "flat-cache";
import { BedrockVersionsFile } from "./versions";
import { isProduction } from "./util";

// use tmp on production
const cacheDirectory = isProduction() ? join("/tmp", ".cache") : "";

// store ratelimited call as a file and fetch when needed
const checkCache = (): BedrockVersionsFile | undefined => {
  // try to use the static docs.json file first (built at build time)
  try {
    const docsPath = resolve("public/static/docs.json");
    const docsContent = fs.readFileSync(docsPath, "utf-8");
    const parsedContent = JSON.parse(docsContent);
    if (parsedContent) return parsedContent as BedrockVersionsFile;
  } catch (error) {
    // console.error("Could not load docs content from cache!", error);
  }

  if (!isProduction()) {
    const cache = flatCache.create({
      cacheId: "versions",
      cacheDir: cacheDirectory,
    });
    const timestamp: string = cache.getKey("timestamp");
    if (timestamp) {
      const cachedTime = new Date(timestamp);
      const currentTime = new Date();
      // difference in mins
      const difference = Math.round(
        (currentTime.getTime() - cachedTime.getTime()) / 60000,
      );

      const files: BedrockVersionsFile = cache.getKey("files");
      // update every 10 min
      if (difference < 10 && files) return files;
    }
  }
};

const setCache = (files: BedrockVersionsFile) => {
  const cache = flatCache.create({
    cacheId: "versions",
    cacheDir: cacheDirectory,
  });
  cache.setKey("timestamp", new Date().getTime());
  cache.setKey("files", files);
  cache.save();
};

export { setCache, checkCache };
