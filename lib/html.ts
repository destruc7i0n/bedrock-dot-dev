import Prism from 'prismjs'
import 'prismjs/components/prism-json'

import Log from './log'

import { SidebarStructure, SidebarStructureElement } from '../components/sidebar'
import { removeHashIfNeeded } from './util'

const TABLE_MATCH = /<table .*>([^]*?)<\/table>/
const TH_MATCH = /<th>(.*)<\/th>/
const TD_MATCH = /<td style=".*">(minecraft:.*)<\/td>/g
const LINK_MATCH = /<a href="(#.*)">(.*)<\/a>/
const H1_MATCH = /<h1>(.*)<\/h1>/

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

const getComponentsList = (html: string): SidebarStructureElement[] => {
  Log.info('Generating components list...')
  const components = [
    ...scrapeTable(html, 'Components'),
    ...scrapeTable(html, 'Properties')
  ]
  Log.info(`Found ${components.length} components`)
  return components
}

const getAIGoals = (html: string): SidebarStructureElement[] => {
  Log.info('Generating AI Goals list...')
  const goals = [
    ...scrapeTable(html, 'AI Goals')
  ]
  Log.info(`Found ${goals.length} AI goals`)
  return goals
}

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

const toTitleCase = (s: string) =>
  s.split(' ')
    .map(p =>
      p === p.toUpperCase() && p.length < 4
        ? p
        : p[0].toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')

const getTitle = (html: string): string => {
  let title = 'Documentation'

  const h1 = html.match(H1_MATCH)
  if (h1) {
    // remove the line break
    title = h1[1].replace(/<\/?br>/, '')
  }

  // convert to title case
  title = toTitleCase(title)
  return title
}

export type ParseHtmlResponse = {
  sidebar: SidebarStructure
  title: string
}

export const parseHtml = (html: string, file: string): ParseHtmlResponse => {
  const title = getTitle(html)

  Log.info(`Title: "${title}"`)

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

  Log.info(`Found ${Object.keys(sidebarContent).length} sidebar headings`)

  return {
    sidebar: sidebarContent,
    title
  }
}

const STYLESHEET_MATCH = /<link rel="stylesheet".*href=".*prism\.css.*"><\/link>/

// remove any html from the old generator
export const removeDisplayHtml = (html: string) => {
  // html = html.replace(/[<br\/?>]*?<a .*>Back to top<\/a>[<br\/?>]*?/g, '')
  html = html.replace(TABLE_MATCH, '')
  html = html.replace(STYLESHEET_MATCH, '')

  return html
}

const TEXTAREA_MATCH = /<textarea.*?>([^]*?)<\/textarea>/g

// use prism to highlight the code blocks
export const highlightTextarea = (html: string, file: string) => {
  // the schemas file has a special format
  if (file === 'Schemas') {
    return highlightSchemas(html)
  }

  // highlight JS pages accordingly
  const jsPages = [ 'Scripting', 'UI' ]
  const language = jsPages.includes(file) ? 'javascript' : 'json'

  // replace all textarea with the prism highlight
  return html.replace(TEXTAREA_MATCH, (_, group) => {
    const hl = Prism.highlight(group, Prism.languages[language], language)
    return `<pre class="language-${language}">${hl}</pre>`
  })
}

const MARKDOWN_CODE_MATCH = /```(.*)```/

const highlightSchemas = (html: string) => {
  let schemaContent = html.match(MARKDOWN_CODE_MATCH)

  if (schemaContent) {
    let content = schemaContent[1]

    content = content
      .replace(/<\/br>-+<\/br>/g, '\n') // remove the ----- lines
      .replace(/<\/?br ?\/?>/g, '\n') // remove br and replace with newlines

    content = Prism.highlight(content, Prism.languages.json, 'json')

    html = html.replace(MARKDOWN_CODE_MATCH, '<pre class="language-json">' + content + '</pre>')
  }

  return html
}
