import cheerio from 'cheerio'

import {
  MARKDOWN_CODE_MATCH,
  STYLESHEET_MATCH,
  TABLE_MATCH,
  ONLY_NEWLINES_AND_WHITESPACE,
} from './regex'
import { oneLine } from '../util'

import { addAnchors } from './scrape/sections'

export const cleanHtmlForDisplay = (html: string, file: string, version: string) => {
  html = encloseDocumentationText(html, file, version)
  html = removeDisplayHtml(html)
  html = addAnchors(html)

  return html
}

// add <p> tags around elements
const encloseDocumentationTextRegex = (html: string) => {
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
      if (ONLY_NEWLINES_AND_WHITESPACE.test(single)) continue

      newEl = newEl.replace(match, `<p>${match}</p>`)
    }

    return match.replace(el, newEl)
  })

  return html
}

// add <p> tags around elements
export const encloseDocumentationText = (html: string, file: string, version: string): string => {
  // 1.9.0.10 uses the <> very often so I'll just use the regex method
  if (version === '1.9.0.10') return encloseDocumentationTextRegex(html)

  // use cheerio just here since it is simpler than regex
  // hopefully I do not need to use it again..

  let schemaContent = ''
  switch (file) {
    case 'Animations': {
      // these are tags that cheerio mistakes
      html = html
        .replace('<entity_name>', 'entity_name')
        .replace('<name>', 'name')
        .replace('<resource_pack_root>', 'resource_pack_root')
      break
    }
    case 'Schemas': {
      // copy the markdown stuff to prevent any changes from happening to it
      const markdownCode = html.match(MARKDOWN_CODE_MATCH)
      if (markdownCode) {
        schemaContent = markdownCode[1]
      }
      break
    }
    case 'MoLang': {
      // remove the <> around
      const escape = (s: string) => s.replace(/<([\w\s]+)>/g, (_, group: string) => group)

      // 1.16.100 docs use `` and have html tags in them, fix them
      html = html.replace(/`(.*?)`/g, (_, group: string) => '`' + escape(group) + '`')
      break
    }
  }

  const $ = cheerio.load(html, { decodeEntities: false })
  const body = $('body')

  const expectedTags = [ 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'textarea', 'table', 'tr', 'td', 'pre' ]
  // wrap all text which is not wrapped
  const textBlocks = body.contents().filter(function (_, el) {
    const node = $(el).get(0)

    // alert me of any new tags which may have appeared
    if (node.tagName && !expectedTags.includes(node.tagName.toLowerCase())) {
      if (file !== 'Schemas')
        console.log(`\nFound unexpected tag "${node.tagName}" on page "${file}" (${version})`)
    }

    return node.nodeType === 3 && node.nodeValue.trim() !== '' && node.tagName === null
  })

  // remove `br` tags around to prevent a lot of space
  textBlocks.each(function (_, el) {
    const cheerioEl = $(el)
    const nextTag = cheerioEl.next().get(0).tagName
    if (nextTag.toLowerCase() === 'br') cheerioEl.next().remove()
  })

  textBlocks.wrap('<p/>')

  let updatedHtml = body.html()!

  // re-add the markdown stuff after parsing
  switch (file) {
    case 'Schemas': {
      if (schemaContent) updatedHtml = updatedHtml.replace(MARKDOWN_CODE_MATCH, schemaContent)
      break
    }
  }

  return updatedHtml
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
