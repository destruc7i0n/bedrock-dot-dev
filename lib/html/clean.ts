import { STYLESHEET_MATCH, TABLE_MATCH } from './regex'

export const cleanHtmlForDisplay = (html: string) => {
  return removeDisplayHtml(html)
}

// remove any html from the old generator
export const removeDisplayHtml = (html: string) => {
  // html = html.replace(/[<br\/?>]*?<a .*>Back to top<\/a>[<br\/?>]*?/g, '')
  html = html.replace(TABLE_MATCH, '')
  html = html.replace(STYLESHEET_MATCH, '')

  return html
}
