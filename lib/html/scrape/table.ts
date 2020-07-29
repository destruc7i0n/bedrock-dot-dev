import Log from '../../log'

import { SidebarStructureElement } from '../../../components/sidebar'

import { TABLE_MATCH, TD_MATCH } from '../regex'

const scrapeTable = (html: string, id: string) => {
  let elements: SidebarStructureElement[] = []

  // this needs to be this disgusting to work for the older pages
  const tableRegex =
    `<h2><p id="${id}">${id}<\/p><\/h2>[^]*?` + TABLE_MATCH.source

  const matchComponents = new RegExp(tableRegex)
  const table = html.match(matchComponents)

  // match all the elements of the table
  if (table && table[1]) {
    let match
    while (match = TD_MATCH.exec(table[1]))
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
