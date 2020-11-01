import Log from '../../log'

import { SidebarStructureElement } from '../../../components/sidebar'

import { TABLE_MATCH, TD_COMPONENT_ID_MATCH } from '../regex'

export const getTable = (html: string, id: string, tagNum: number) => {
  const tableRegex =
    `<h${tagNum}><p id="${id}">${id}<\/p><\/h${tagNum}>[^]*?` + TABLE_MATCH.source

  const match = new RegExp(tableRegex)
  const matchResult = html.match(match)
  return matchResult && matchResult[0] ? matchResult[0] : null
}

const scrapeTable = (html: string, id: string) => {
  let elements: SidebarStructureElement[] = []

  // this needs to be this disgusting to work for the older pages
  const table = getTable(html, id, 2)

  // match all the elements of the table
  if (table) {
    let match
    while (match = TD_COMPONENT_ID_MATCH.exec(table))
      elements.push({
        id: match[1],
        title: match[1],
      })
  }

  return elements
}

export const getComponentsList = (html: string): SidebarStructureElement[] => {
  Log.info('Generating components list...')
  const components = [
    ...scrapeTable(html, 'Components'),
    ...scrapeTable(html, 'Attributes'),
    ...scrapeTable(html, 'Properties')
  ]
  Log.info(`Found ${components.length} components`)
  return components
}

export const getAIGoals = (html: string): SidebarStructureElement[] => {
  Log.info('Generating AI Goals list...')
  const goals = [
    ...scrapeTable(html, 'AI Goals')
  ]
  Log.info(`Found ${goals.length} AI goals`)
  return goals
}
