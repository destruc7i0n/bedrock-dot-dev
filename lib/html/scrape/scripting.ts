// get the regex for the title
import { SidebarStructure } from '../../../components/sidebar'
import { H_TITLE_MATCH } from '../regex'

// const getTitleMatchRegex = (tag: string) => new RegExp(`<${tag}><p id="(.*)">(.*)<\/p><\/${tag}>`, 'g')

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

const getScriptingComponents = (html: string) => {
  const sections = [
    'Block Components',
    'Client Components',
    'Level Components',
    'Server Components',
  ]
  return getSections(html, sections)
}

const getScriptingEvents = (html: string) => {
  const sections = [
    'Client Events',
    'Server Events',
  ]
  return getSections(html, sections)
}

export { getScriptingComponents, getScriptingEvents }
