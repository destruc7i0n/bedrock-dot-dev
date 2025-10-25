import { join } from "path";

import * as flatCache from "flat-cache";
import { BedrockVersionsFile } from "./versions";
import Log from "./log";

// use tmp on production
const cacheDirectory =
  process.env.NODE_ENV === "production" ? join("/tmp", ".cache") : "";

// store ratelimited call as a file and fetch when needed
const checkCache = (): BedrockVersionsFile | undefined => {
  // try to use the static docs.json file first (built at build time)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const docsContent = require("../public/static/docs.json");
    if (docsContent) return docsContent as BedrockVersionsFile;
  } catch (error) {
    Log.error("Could not load docs content from cache!", error);
  }

  if (process.env.NODE_ENV !== "production") {
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
