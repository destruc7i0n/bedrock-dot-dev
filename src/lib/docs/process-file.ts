import { Locale } from "../i18n";
import { getDocsFilesFromRepo } from "../github/raw";
import { cleanHtmlForDisplay } from "../html/clean";
import { highlightHtml } from "../html/highlight";
import { extractDataFromHtml } from "../html";
import type { SidebarStructure } from "../../components/sidebar";

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

  const pathWithoutExt = `${major}/${minor}/${file}`;

  try {
    // 1. Fetch raw HTML from GitHub
    // NOTE: getDocsFilesFromRepo adds .html extension
    const rawHtml = await getDocsFilesFromRepo(pathWithoutExt, locale);

    // 2. Clean HTML for display
    // CRITICAL: cleanHtmlForDisplay takes (html, file, MINOR_VERSION)
    let displayHtml = cleanHtmlForDisplay(rawHtml, file, minor);

    // 3. Highlight code blocks
    displayHtml = highlightHtml(displayHtml, file);

    // 4. Extract metadata from RAW html (not displayHtml!)
    const { sidebar, title } = extractDataFromHtml(rawHtml, file);

    return {
      major,
      minor,
      file,
      html: displayHtml, // The processed HTML for display
      sidebar,
      title,
    };
  } catch (error) {
    console.error(`Error processing ${pathWithoutExt}:`, error);
    return null;
  }
}
