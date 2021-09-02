import {
  MARKDOWN_CODE_MATCH,
  STYLESHEET_MATCH,
  TABLE_MATCH,
  ONLY_NEWLINES_AND_WHITESPACE,
} from './regex'
import { getVersionParts, oneLine } from '../util'

import { addAnchors } from './scrape/sections'
import { addAnchorsToMoLangQueries } from './clean/molang'

export const cleanHtmlForDisplay = (html: string, file: string, version: string) => {
  const versionNumber = getVersionParts(version)[1]

  html = removeDisplayHtml(html)
  if (versionNumber >= 16) {
    html = encloseDocumentationText(html, file)
  }

  switch (file.toLowerCase()) {
    case 'molang': {
      html = addAnchorsToMoLangQueries(html)
      break
    }
    default: break
  }

  html = addAnchors(html)

  return html
}

// add <p> tags around elements
const encloseDocumentationText = (html: string, file: string) => {
  // debug helper [...document.getElementsByTagName('p')].forEach(e => e.style.background = 'red')
  // match stuff between headings
  html = html.replace(/<\/h[1-4]>([^]*?)(?:<h[1-4]|$)/g, (match: string, el: string) => {
    // ignore if only newlines or whitespace
    const trimmed = el.trim()

    // same as TEXTAREA_MATCH and GREEDY_TABLE_MATCH but without any groups
    const rawTableMatch = /<table.*?>[^]*<\/table>/g
    const rawTextareaMatch = /<textarea.*?>[^]*?<\/textarea>/g
    const bothMatches = new RegExp(`(?:${rawTableMatch.source}|${rawTextareaMatch.source})`, 'g')

    let newEl = el

    for (let match of trimmed.split(bothMatches)) {
      const single = oneLine(match)
      if (ONLY_NEWLINES_AND_WHITESPACE.test(single) || !match.trim().length) continue
      // don't enclose the schemas
      if (file === 'Schemas' && MARKDOWN_CODE_MATCH.test(match)) continue

      let content = match
      if (file.toLowerCase() === 'molang') {
        // replace any elements mistaken for html tags in ``
        content = content.replace(/`(.*?)`/g, (_, group: string) => {
          // remove the <> around them
          return '`' + group.replace(/<([\w\s]+)>/g, (_, group: string) => group) + '`'
        })
      }

      newEl = newEl.replace(match, `<p>${content}</p>`)
    }

    return match.replace(el, newEl)
  })

  return html
}

// remove any html from the old generator
export const removeDisplayHtml = (html: string) => {
  html = html.replace(/<a .*>Back to top<\/a>(?:<br\/?>)?/g, '')
  html = html.replace(TABLE_MATCH, '')
  html = html.replace(STYLESHEET_MATCH, '')
  // remove any empty headers
  html = html.replace(/<h\d><\/h\d>/g, '')

  return html
}
