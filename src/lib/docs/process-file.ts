import type { SidebarStructure } from "@components/sidebar";

import { extractDataFromHtml, fetchHtml } from "../html";
import { Locale } from "../i18n";
import Log from "../log";

export interface ProcessedDoc {
  major: string;
  minor: string;
  file: string;
  html: string; // displayHtml - processed and ready to render
  sidebar: SidebarStructure;
  title: {
    title?: string;
    version?: string;
  };
}

/**
 * Process a documentation file from GitHub
 * @param pathParts - Array of path parts: [major, minor, file] or [major, file] for old format
 * @param locale - Locale to fetch from
 * @returns Processed document or null if processing fails
 */
export async function processDocFile(
  pathParts: string[],
  locale: Locale,
): Promise<ProcessedDoc | null> {
  // Ensure pathParts is an array
  if (!Array.isArray(pathParts)) {
    console.error(
      `pathParts must be an array, received: ${typeof pathParts}`,
      pathParts,
    );
    return null;
  }

  let major: string, minor: string, file: string;

  if (pathParts.length === 3) {
    [major, minor, file] = pathParts;
  } else if (pathParts.length === 2) {
    // Old 1.8 format - major and file only
    [major, file] = pathParts;
    minor = major;
  } else {
    console.error(`Unexpected path format: ${pathParts.join("/")}`);
    return null;
  }

  try {
    const htmlData = await fetchHtml([major, minor, file], locale);
    if (!htmlData) {
      return null;
    }

    const id = `${major}/${minor}/${file}`;

    Log.info(`Processing ${id}...`);
    const { sidebar, title } = extractDataFromHtml(htmlData.html, file);

    return {
      major,
      minor,
      file,
      html: htmlData.displayHtml,
      sidebar,
      title,
    };
  } catch (error) {
    console.error(`Error processing ${major}/${minor}/${file}:`, error);
    return null;
  }
}
