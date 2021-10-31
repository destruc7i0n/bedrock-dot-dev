import { getDocsFilesFromRepo } from 'lib/github/raw'
import Log from 'lib/log'
import { Locale } from 'lib/i18n'
import { cleanHtmlForDisplay } from './clean'
import { highlightHtml } from './highlight'

const fetchHtml = async (version: string[], locale: Locale) => {
  const file = version[2]
  const path = version.join('/')

  let html: string | null = null
  let displayHtml: string | null = null

  try {
    html = await getDocsFilesFromRepo(path, locale)
  } catch (e) {
    Log.error(`Could not get file for "${path}"!`)
    return null
  }

  // the html to be presented on the site
  displayHtml = cleanHtmlForDisplay(html, file, version[1])
  displayHtml = highlightHtml(displayHtml, file)

  return {
    html,
    displayHtml,
  }
}

export default fetchHtml