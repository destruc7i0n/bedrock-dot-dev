import Log from './log'

import { SidebarStructure } from '../components/sidebar'
import { getTitle, TitleResponse } from './html/scrape/title'
import { getAIGoals, getComponentsList }  from './html/scrape/table'
import { getScriptingEvents, getScriptingComponents } from './html/scrape/scripting'
import { LINK_MATCH, TABLE_MATCH, TH_MATCH } from './html/regex'
import { removeHashIfNeeded } from './util'

const getSidebarContent = (html: string): SidebarStructure => {
  let format: SidebarStructure = {}

  // get the first table on the page
  const table = html.match(TABLE_MATCH)
  if (table) {
    // the inner html of the table
    const inner = table[1]
    const lines = inner.split('\n')

    // the current title of the group
    let currentTitle = ''
    for (let line of lines) {
      // get the data from the link on the line
      const link = line.match(LINK_MATCH)
      if (link) {
        const id = link[1]
        const title = link[2].trimLeft()

        // if this is a title, then update the current title
        let isTitle = false
        if (TH_MATCH.test(line)) {
          currentTitle = title
          isTitle = true
        }

        // initialize title object
        if (!format[currentTitle]) format[currentTitle] = []

        // add the link to the current title
        if (!isTitle && title && title.length && id && id.length) {
          format[currentTitle].push({
            id: removeHashIfNeeded(id),
            title: removeHashIfNeeded(title)
          })
        }
      }
    }
  }

  return format
}

export type ParseHtmlResponse = {
  sidebar: SidebarStructure
  title: TitleResponse
}

export const extractDataFromHtml = (html: string, file: string): ParseHtmlResponse => {
  const title = getTitle(html)

  Log.info(`Title data: "${title.title} ${title.version}"`)

  let sidebarContent = getSidebarContent(html)
  if (file && file === 'Entities') {
    const componentsList = getComponentsList(html)
    // only add the sidebar components entry if there are any found
    if (componentsList.length) {
      sidebarContent['Components'] =
        componentsList.sort((a, b) => a.title.localeCompare(b.title))
      // order the object and bring the components list to the top
      sidebarContent = {
        'Components': sidebarContent['Components'],
        ...sidebarContent
      }
    }

    if (!sidebarContent['AI Goals']) {
      sidebarContent = {
        'Components': sidebarContent['Components'],
        'AI Goals': getAIGoals(html),
        ...sidebarContent,
      }
    }
  }

  // insert the scraped component and event list from the html at the correct location
  if (file && file === 'Scripting') {
    let newSidebarContent: SidebarStructure = {}
    for (let key of Object.keys(sidebarContent)) {
      switch (key) {
        case 'Script Components': {
          newSidebarContent = {
            ...newSidebarContent,
            ...getScriptingComponents(html)
          }
          break
        }
        case 'Script Events': {
          newSidebarContent = {
            ...newSidebarContent,
            ...getScriptingEvents(html)
          }
          break
        }
        default: {
          newSidebarContent[key] = sidebarContent[key]
          break
        }
      }
    }
    sidebarContent = newSidebarContent
  }

  Log.info(`Found ${Object.keys(sidebarContent).length} sidebar headings`)

  return {
    sidebar: sidebarContent,
    title
  }
}
