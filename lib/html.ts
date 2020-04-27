import { SidebarStructure } from '../components/sidebar'

const TABLE_MATCH = /<table .*>([^]*?)<\/table>/
const TH_MATCH = /<th>(.*)<\/th>/
const LINK_MATCH = /<a href="(#.*)">(.*)<\/a>/
const H1_MATCH = /<h1>(.*)<\/h1>/

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
    return h1[1].replace('</br>', '')
  }
  return 'DOCUMENTATION'
}

export type ParseHtmlResponse = {
  sidebar: SidebarStructure
  title: string
}

export const parseHtml = (html: string): ParseHtmlResponse => {
  const sidebarContent = getSidebarContent(html)
  const title = getTitle(html)

  return {
    sidebar: sidebarContent,
    title
  }
}

const STYLESHEET_MATCH = /<link rel="stylesheet".*href=".*prism\.css.*"><\/link>/

export const removeDisplayHtml = (html: string) => {
  html = html.replace(TABLE_MATCH, '')
  html = html.replace(STYLESHEET_MATCH, '')

  return html
}
