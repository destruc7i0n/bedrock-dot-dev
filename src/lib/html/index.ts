import type {
  SidebarStructure,
  SidebarStructureElement,
} from "@components/sidebar";
import { getTitle } from "./scrape/title";
import type { TitleResponse } from "./scrape/title";
import { getAIGoals, getComponentsList } from "./scrape/table";
import { LINK_MATCH, TABLE_MATCH, TH_MATCH } from "./regex";
import { removeHashIfNeeded } from "../util";

export { default as fetchHtml } from "./fetch";

const getSidebarContent = (html: string): SidebarStructure => {
  const format: SidebarStructure = {};

  // get the first table on the page
  const table = html.match(TABLE_MATCH);
  if (table) {
    // the inner html of the table
    const inner = table[1];
    const lines = inner.split("\n");

    // the current id of the group
    let currentId = "";
    for (const line of lines) {
      // get the data from the link on the line
      const link = line.match(LINK_MATCH);
      if (link) {
        const id = link[1];
        const title = link[2].trimStart();

        // if this is a title, then update the current title
        let isTitle = false;
        if (TH_MATCH.test(line)) {
          currentId = id;
          isTitle = true;
        }

        const el: SidebarStructureElement = {
          id: removeHashIfNeeded(id),
          title: removeHashIfNeeded(title),
        };

        // get the current title
        if (!format[currentId])
          format[currentId] = { header: el, elements: [] };

        // add the link to the current id
        if (!isTitle && title && title.length && id && id.length) {
          format[currentId].elements.push(el);
        }
      }
    }
  }

  return format;
};

export type ParseHtmlResponse = {
  sidebar: SidebarStructure;
  title: TitleResponse;
};

export const extractDataFromHtml = (
  html: string,
  file: string,
): ParseHtmlResponse => {
  const title = getTitle(html);

  console.log(`Title data: ${JSON.stringify(title)}`);

  let sidebarContent = getSidebarContent(html);
  if (file && file === "Entities") {
    const componentsList = getComponentsList(html);
    // only add the sidebar components entry if there are any found
    if (componentsList.elements.length) {
      sidebarContent["Components"] = {
        ...componentsList,
        elements: componentsList.elements.sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
      };
      // order the object and bring the components list to the top
      const orderedContent: SidebarStructure = {
        Components: sidebarContent["Components"],
      };
      for (const key in sidebarContent) {
        if (key !== "Components") {
          orderedContent[key] = sidebarContent[key];
        }
      }
      sidebarContent = orderedContent;
    }

    if (!sidebarContent["AI Goals"]) {
      const aiGoals = getAIGoals(html);
      const orderedContent: SidebarStructure = {};
      if (sidebarContent["Components"]) {
        orderedContent["Components"] = sidebarContent["Components"];
      }
      orderedContent["AI Goals"] = aiGoals;
      for (const key in sidebarContent) {
        if (key !== "Components" && key !== "AI Goals") {
          orderedContent[key] = sidebarContent[key];
        }
      }
      sidebarContent = orderedContent;
    }
  }

  const total = Object.keys(sidebarContent).reduce(
    (acc, key) => acc + sidebarContent[key]?.elements?.length + 1,
    0,
  );
  console.log(
    `Found ${
      Object.keys(sidebarContent).length
    } sidebar headings, ${total} total elements`,
  );

  return {
    sidebar: sidebarContent,
    title,
  };
};
