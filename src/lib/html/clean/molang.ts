import { TD_MOLANG_QUERY_MATCH } from "../regex";
import { getTable } from "../scrape/table";

export const addAnchorsToMoLangQueries = (html: string) => {
  const tags = [
    "List of Entity Queries",
    "List of Experimental Entity Queries",
  ];

  for (const tag of tags) {
    const { table } = getTable(html, tag, 1);
    if (table) {
      const updatedTable = table.replace(TD_MOLANG_QUERY_MATCH, (row, query) => {
        // replicate the h5 element mojang uses some places
        const h5 = `<h4><p id="${query}">${query}</p></h4>`;
        return row.replace(query, h5);
      });
      html = html.replace(table, updatedTable);
    }
  }

  return html;
};
