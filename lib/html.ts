import Prism from 'prismjs'
// @ts-ignore
import loadLanguges from 'prismjs/components/index'

loadLanguges(['json'])

import { SidebarStructure, SidebarStructureElement } from '../components/sidebar'

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

  if (table && table[1]) {
    let match
    while (match = TD_MATCH.exec(table[1]))
      elements.push({
        title: match[1],
        id: match[1],
      })
  }

  return elements
}

const getComponentsList = (html: string): SidebarStructureElement[] => {
  console.log('Generating components list...')
  const components = [
    ...scrapeTable(html, 'Components'),
    ...scrapeTable(html, 'Properties')
  ]
  console.log(`Found ${components.length} components`)
  return components
}

const getAIGoals = (html: string): SidebarStructureElement[] => {
  console.log('Generating AI Goals list...')
  const goals = [
    ...scrapeTable(html, 'AI Goals')
  ]
  console.log(`Found ${goals.length} AI goals`)
  return goals
}

const getSidebarContent = (html: string): SidebarStructure => {
  let format: SidebarStructure = {}

  // get the first table on the page
  const table = html.match(TABLE_MATCH)
  if (table) {
    const inner = table[1]
    const lines = inner.split('\n')

    let currentTitle = ''
    for (let line of lines) {
      const link = line.match(LINK_MATCH)
      if (link) {
        const id = link[1]
        const title = link[2].trimLeft()

        let isTitle = false
        if (TH_MATCH.test(line)) {
          currentTitle = title
          isTitle = true
        }

        if (!format[currentTitle]) format[currentTitle] = []

        if (!isTitle && title && title.length && id && id.length) {
          format[currentTitle].push({
            id,
            title
          })
        }
      }
    }
  }

  return format
}

const getTitle = (html: string): string => {
  const h1 = html.match(H1_MATCH)
  if (h1) {
    // remove the line break
    return h1[1].replace(/<\/?br>/, '')
  }
  return 'DOCUMENTATION'
}

export type ParseHtmlResponse = {
  sidebar: SidebarStructure
  title: string
}

export const parseHtml = (html: string, file: string): ParseHtmlResponse => {
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
  const title = getTitle(html)

  return {
    sidebar: sidebarContent,
    title
  }
}

const STYLESHEET_MATCH = /<link rel="stylesheet".*href=".*prism\.css.*"><\/link>/

export const removeDisplayHtml = (html: string) => {
  // html = html.replace(/[<br\/?>]*?<a .*>Back to top<\/a>[<br\/?>]*?/g, '')
  html = html.replace(TABLE_MATCH, '')
  html = html.replace(STYLESHEET_MATCH, '')

  return html
}

const TEXTAREA_MATCH = /<textarea.*?>([^]*?)<\/textarea>/g

export const highlightTextarea = (html: string, file: string) => {
  if (file === 'Schemas') {
    return highlightSchemas(html)
  }

  const jsPages = [ 'Scripting', 'UI' ]
  const language = jsPages.includes(file) ? 'javascript' : 'json'

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
