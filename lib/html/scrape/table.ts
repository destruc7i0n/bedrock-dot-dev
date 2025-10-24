import Log from "../../log";

import { SidebarStructureElement } from "../../../components/sidebar";

import { TABLE_MATCH, TD_COMPONENT_ID_MATCH } from "../regex";
import { SidebarStructureGroup } from "../../../components/sidebar/sidebar";

export const getTable = (html: string, id: string, tagNum: number) => {
  const tableRegex =
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
  Log.info("Generating components list...");

  const componentsScrape = scrapeTable(html, "Components");
  const components = [
    ...componentsScrape.elements,
    ...scrapeTable(html, "Attributes").elements,
    ...scrapeTable(html, "Properties").elements,
  ];
  Log.info(`Found ${components.length} components`);

  return {
    header: { id: "Components", title: componentsScrape.title ?? "" },
    elements: components,
  };
};

export const getAIGoals = (html: string): SidebarStructureGroup => {
  Log.info("Generating AI Goals list...");
  const scrape = scrapeTable(html, "AI Goals");
  Log.info(`Found ${scrape.elements.length} AI goals`);
  return {
    header: { id: "AI Goals", title: scrape.title ?? "" },
    elements: scrape.elements,
  };
};
