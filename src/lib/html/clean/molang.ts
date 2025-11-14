import { TD_MOLANG_QUERY_MATCH } from "../regex";
import { getTable } from "../scrape/table";

export const addAnchorsToMoLangQueries = (html: string) => {
  const tags = [
    "List of Entity Queries",
    "List of Experimental Entity Queries",
  ];

  for (const tag of tags) {
    const { table } = getTable(html, tag, 1);
    let updatedTable = `${table}`;
    if (table) {
      const rows = Array.from(table.matchAll(TD_MOLANG_QUERY_MATCH));
      for (const row of rows) {
        const rowQueryTD = row[0];
        const rowQuery = row[1];
        // replicate the h5 element mojang uses some places
        const h5 = `<h4><p id="${rowQuery}">${rowQuery}</p></h4>`;
        // replace each row with the updated row with header links
        updatedTable = updatedTable.replace(
          rowQueryTD,
          rowQueryTD.replace(rowQuery, h5),
        );
      }
      html = html.replace(table, updatedTable);
    }
  }

  return html;
};
