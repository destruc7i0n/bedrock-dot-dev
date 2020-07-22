import { STYLESHEET_MATCH, TABLE_MATCH } from './regex'

import { addAnchors } from './scrape/sections'

export const cleanHtmlForDisplay = (html: string) => {
  html = removeDisplayHtml(html)
  html = addAnchors(html)

  return html
}

// remove any html from the old generator
export const removeDisplayHtml = (html: string) => {
  // html = html.replace(/[<br\/?>]*?<a .*>Back to top<\/a>[<br\/?>]*?/g, '')
  html = html.replace(TABLE_MATCH, '')
  html = html.replace(STYLESHEET_MATCH, '')

  return html
}
