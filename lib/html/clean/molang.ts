import { getTable } from '../scrape/table'

import { TD_MOLANG_QUERY_MATCH } from '../regex'

export const addAnchorsToMoLangQueries = (html: string) => {
  const table = getTable(html, 'List of Entity Queries', 1)
  let updatedTable = `${table}`
  if (table) {
    const rows = table.matchAll(TD_MOLANG_QUERY_MATCH)
    for (let row of rows) {
      const rowQueryTD = row[0]
      const rowQuery = row[1]
      // replicate the h5 element mojang uses some places
      const h5 = `<h4><p id="${rowQuery}">${rowQuery}</p></h4>`
      // replace each row with the updated row with header links
      updatedTable = updatedTable.replace(
        rowQueryTD,
        rowQueryTD.replace(rowQuery, h5)
      )
    }
    return html.replace(table, updatedTable)
  }
  return html
}
