import { SidebarStructure } from '../components/sidebar'

const TABLE_MATCH = /<table .*>([^]*?)<\/table>/
const TH_MATCH = /<th>(.*)<\/th>/
const TD_MATCH = /<td style=".*">(minecraft:.*)<\/td>/g
const LINK_MATCH = /<a href="(#.*)">(.*)<\/a>/
const H1_MATCH = /<h1>(.*)<\/h1>/

const getComponentsList = (html: string): SidebarStructure => {
  let components: SidebarStructure = {
    'Components': []
  }

  const getComponents = (id: string) => {
    // this needs to be this disgusting to work for the older pages
    const tableRegex =
      `<h2><p id="${id}">${id}<\/p><\/h2>[^]*?` + TABLE_MATCH.source

    const matchComponents = new RegExp(tableRegex)
    const componentsTable = html.match(matchComponents)

    // console.log(/<h2><p id="Components">Components<\/p><\/h2>.*<table .*>/.test(html))

    if (componentsTable && componentsTable[1]) {
      let match
      while (match = TD_MATCH.exec(componentsTable[1])) components['Components'].push({
        title: match[1],
        id: match[1],
      })
      // console.log(components['Components'].length)
    }
  }

  // match these two groups and add to the sidebar
  getComponents('Components')
  getComponents('Properties')

  return components
}

const getSidebarContent = (html: string): SidebarStructure => {
  let format: SidebarStructure = {}

  // get the first table on the page
  const table = html.match(TABLE_MATCH)
  if (table) {
    const inner = table[1]
    const lines = inner.split('\n')

    let currentTitle = ''
    for (let line of lines) {
      const link = line.match(LINK_MATCH)
      if (link) {
        const id = link[1]
        const title = link[2].trimLeft()

        let isTitle = false
        if (TH_MATCH.test(line)) {
          currentTitle = title
          isTitle = true
        }

        if (!format[currentTitle]) format[currentTitle] = []

        if (!isTitle && title && title.length && id && id.length) {
          format[currentTitle].push({
            id,
            title
          })
        }
      }
    }
  }

  return format
}

const getTitle = (html: string): string => {
  const h1 = html.match(H1_MATCH)
  if (h1) {
    // remove the line break
    return h1[1].replace(/<\/?br>/, '')
  }
  return 'DOCUMENTATION'
}

export type ParseHtmlResponse = {
  sidebar: SidebarStructure
  sidebarIds: string[]
  title: string
}

export const parseHtml = (html: string, file: string): ParseHtmlResponse => {
  let sidebarContent = getSidebarContent(html)
  if (file && file === 'Entities') {
    const componentsList = getComponentsList(html)
    // only add the sidebar components entry if there are any found
    if (componentsList['Components'].length) {
      sidebarContent['Components'] = componentsList['Components'].sort((a, b) => a.title.localeCompare(b.title))
      // order the object and bring the components list to the top
      sidebarContent = {
        'Components': sidebarContent['Components'],
        ...sidebarContent
      }
    }
  }
  const title = getTitle(html)

  const sidebarIds = [
    ...Object.keys(sidebarContent),
    ...Object.keys(sidebarContent).reduce<string[]>((acc, el) => {
      acc.push(...sidebarContent[el].map(e => e.id))
      return acc
    }, [])
  ]

  return {
    sidebar: sidebarContent,
    sidebarIds,
    title
  }
}

const STYLESHEET_MATCH = /<link rel="stylesheet".*href=".*prism\.css.*"><\/link>/

export const removeDisplayHtml = (html: string) => {
  // html = html.replace(/[<br\/?>]*?<a .*>Back to top<\/a>[<br\/?>]*?/g, '')
  html = html.replace(TABLE_MATCH, '')
  html = html.replace(STYLESHEET_MATCH, '')

  return html
}
