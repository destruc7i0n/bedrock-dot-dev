// get the regex for the title
import { SidebarStructure } from '../../../components/sidebar'

import { H_TITLE_MATCH, P_ID_MATCH } from '../regex'

import { oneLine } from '../../util'

const addAnchors = (html: string) => {
  return html.replace(H_TITLE_MATCH, (value) => {
    const [ el, id, title ] = value.match(P_ID_MATCH)!
    const anchoredEl = oneLine(
      `<p id="${id}">
        <span class="anchored">
          <a href="#${encodeURIComponent(id)}" tabindex="-1" class="anchor" aria-label="Anchor" aria-hidden="true">#</a>
          ${title}
        </span>
      </p>`
    )
    return value.replace(el, anchoredEl)
  })
}

const getSection = (html: string, title: string) => {
  // match the title and everything up to the next title or eof
  const sectionRe = `<h1><p id="${title}">${title}<\/p><\/h1>([^]*?)(<h1>|$)`
  const matchSection = new RegExp(sectionRe)

  const match = html.match(matchSection)
  if (match && match[1]) {
    return match[1]
  }
  return null
}

const getFromTitle = (section: string) => {
  const events: string[] = []

  let match
  while (match = H_TITLE_MATCH.exec(section)) {
    if (match && match[1] && match[1].startsWith('minecraft:'))
      events.push(match[1])
  }
  return events
}

const getSections = (html: string, sections: string[]) => {
  const resp: SidebarStructure = {}

  for (let section of sections) {
    const sectionContent = getSection(html, section)
    if (sectionContent) {
      const content = getFromTitle(sectionContent)
      // make into the format for the sidebar
      resp[section] = content.map((c) => ({ title: c, id: c }))
    }
  }

  return resp
}

export { getSections, addAnchors }
