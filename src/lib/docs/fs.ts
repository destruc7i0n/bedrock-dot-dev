import { readdirSync, existsSync } from "fs";
import { join, resolve } from "path";
import { Locale } from "../i18n";
import { DOCS_SUBMODULE_PATH } from "./constants";

export interface GitHubTreeResponse {
  tree: {
    path: string;
    type: "tree" | "blob";
    url: string;
  }[];
}

export async function listAllFilesFromRepo(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _locale: Locale,
): Promise<GitHubTreeResponse | Error> {
  const submodulePath = resolve(process.cwd(), DOCS_SUBMODULE_PATH);

  if (!existsSync(submodulePath)) {
    return new Error(`Submodule not found at ${submodulePath}`);
  }

  const tree: GitHubTreeResponse["tree"] = [];

  const scanDirectory = (dirPath: string, relativePath = ""): void => {
    const entries = readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const relativeFilePath = relativePath
        ? join(relativePath, entry.name)
        : entry.name;

      if (entry.isDirectory()) {
        scanDirectory(fullPath, relativeFilePath);
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        tree.push({
          path: relativeFilePath.replace(/\\/g, "/"),
          type: "blob",
          url: "",
        });
      }
    }
  };

  try {
    scanDirectory(submodulePath);
    return { tree };
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error(`Failed to scan submodule: ${String(error)}`);
  }
}
