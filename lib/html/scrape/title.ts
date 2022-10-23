import { H1_MATCH, VERSION } from '../regex'

export type TitleResponse = {
  version: string,
  title: string,
}

const toTitleCase = (s: string) =>
  s.split(' ')
    .map(p =>
      p === p.toUpperCase() && p.length < 4
        ? p
        : p[0].toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')
    // .replace('Molang', 'MoLang') // custom name

export const getTitle = (html: string): TitleResponse => {
  let title = ''

  const h1 = html.match(H1_MATCH)
  if (h1) {
    // remove the line break
    title = h1[1].replace(/<\/?br>/, '')
  }
  // convert to title case
  title = toTitleCase(title)

  let resp: TitleResponse = { version: '', title: '' }
  const titleRe = new RegExp(`(.*) Documentation Version: ${VERSION.source}`)

  const titleMatch = title.match(titleRe)
  if (titleMatch) {
    resp.title = titleMatch[1]
    resp.version = titleMatch[2]
  }

  return resp
}
