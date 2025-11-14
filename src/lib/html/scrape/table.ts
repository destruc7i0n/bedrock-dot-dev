import type {
  SidebarStructureElement,
  SidebarStructureGroup,
} from "@components/sidebar";

import { TABLE_MATCH, TD_COMPONENT_ID_MATCH } from "../regex";

export const getTable = (html: string, id: string, tagNum: number) => {
  const tableRegex =
    // eslint-disable-next-line no-useless-escape
    `<h${tagNum}><p id="${id}">(.*?)<\/p><\/h${tagNum}>[^]*?` +
    TABLE_MATCH.source;

  const match = new RegExp(tableRegex);
  const matchResult = html.match(match);
  return {
    title: matchResult?.[1],
    table: matchResult?.[2],
  };
};

const scrapeTable = (html: string, id: string) => {
  const elements: SidebarStructureElement[] = [];

  // this needs to be this disgusting to work for the older pages
  const { title, table } = getTable(html, id, 2);

  // match all the elements of the table
  if (table) {
    let match;
    while ((match = TD_COMPONENT_ID_MATCH.exec(table)))
      elements.push({
        id: match[1],
        title: match[1],
      });
  }

  return { title, elements };
};

export const getComponentsList = (html: string): SidebarStructureGroup => {
  console.log("Generating components list...");

  const componentsScrape = scrapeTable(html, "Components");
  const components = [
    ...componentsScrape.elements,
    ...scrapeTable(html, "Attributes").elements,
    ...scrapeTable(html, "Properties").elements,
  ];
  console.log(`Found ${components.length} components`);

  return {
    header: { id: "Components", title: componentsScrape.title ?? "" },
    elements: components,
  };
};

export const getAIGoals = (html: string): SidebarStructureGroup => {
  console.log("Generating AI Goals list...");
  const scrape = scrapeTable(html, "AI Goals");
  console.log(`Found ${scrape.elements.length} AI goals`);
  return {
    header: { id: "AI Goals", title: scrape.title ?? "" },
    elements: scrape.elements,
  };
};
