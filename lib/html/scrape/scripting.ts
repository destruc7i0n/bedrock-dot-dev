import { getSections } from './sections'

// this does not work well since the events and components may be duplicated
// keeping in case I want to do something about this in the future

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

export default { getScriptingEvents, getScriptingComponents }
