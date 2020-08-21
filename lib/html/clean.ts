import { oneLine } from 'lib/util'
import log from 'lib/log'

import {
  ONLY_NEWLINES_AND_WHITESPACE,
  STYLESHEET_MATCH,
  TABLE_MATCH,
} from './regex'

import { addAnchors } from './scrape/sections'

export const cleanHtmlForDisplay = (html: string) => {
  html = removeDisplayHtml(html)
  html = addAnchors(html)
  html = encloseDocumentationText(html)

  return html
}

// add <p> tags around elements
export const encloseDocumentationText = (html: string) => {
  // debug helper [...document.getElementsByTagName('p')].forEach(e => e.style.background = 'red')
  // match stuff between headings
  let num = 0
  html = html.replace(/<\/h[1-4]>([^]*?)(?:<h[1-4]|$)/g, (match: string, el: string) => {
    // ignore if only newlines or whitespace
    num += 1
    const trimmed = el.trim()

    // same as TEXTAREA_MATCH and GREEDY_TABLE_MATCH but without any groups
    const rawTableMatch = /<table.*?>[^]*<\/table>/g
    const rawTextareaMatch = /<textarea.*?>[^]*?<\/textarea>/g
    const bothMatches = new RegExp(`(?:${rawTableMatch.source}|${rawTextareaMatch.source})`, 'g')

    let newEl = el

    for (let match of trimmed.split(bothMatches)) {
      const single = oneLine(match)
      if (ONLY_NEWLINES_AND_WHITESPACE.test(single)) continue

      newEl = newEl.replace(match, `<p>${match}</p>`)
    }

    return match.replace(el, newEl)
  })
  log.info(`Found ${num} documentation sections`)

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
