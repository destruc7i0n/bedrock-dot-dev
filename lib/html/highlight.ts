import Prism from 'prismjs'
import 'prismjs/components/prism-json'

import { TEXTAREA_MATCH } from './regex'

// use prism to highlightHtml the code blocks
const highlightTextarea = (html: string, file: string) => {
  // there are no textareas in the schemas page
  if (file === 'Schemas') return html

  // highlightHtml JS pages accordingly
  const jsPages = [ 'Scripting', 'UI' ]
  const language = jsPages.includes(file) ? 'javascript' : 'json'

  // replace all textarea with the prism highlightHtml
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

export const highlightHtml = (html: string, file: string) => {
  switch (file) {
    case 'Schemas': {
      html = highlightSchemas(html)
      break
    }
    default: break
  }
  html = highlightTextarea(html, file)
  return html
}
