import { join, resolve } from "path";
import { promises as fs } from "fs";

import * as flatCache from "flat-cache";
import type { BedrockVersionsFile } from "./versions";
import { isProduction } from "./util";

const CACHE_DURATION_MINUTES = 10;

// use tmp on production
const cacheDirectory = isProduction() ? join("/tmp", ".cache") : "";

// store ratelimited call as a file and fetch when needed
const checkCache = async (): Promise<BedrockVersionsFile | undefined> => {
  // try to use the static docs.json file first (built at build time)
  try {
    const docsPath = resolve("public/static/docs.json");
    const docsContent = await fs.readFile(docsPath, "utf-8");
    const parsedContent = JSON.parse(docsContent);
    if (parsedContent) return parsedContent as BedrockVersionsFile;
  } catch {
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
      if (difference < CACHE_DURATION_MINUTES && files) return files;
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
