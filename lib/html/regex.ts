// simple regex for matching tags in the html

export const H1_MATCH = /<h1>(.*)<\/h1>/
export const TABLE_MATCH = /<table.*>([^]*?)<\/table>/
export const GREEDY_TABLE_MATCH = /<table.*>([^]*)<\/table>/
export const TH_MATCH = /<th>(.*)<\/th>/
export const TD_RAW_MATCH = /<td style=".*">(.*)<\/td>/g
export const TD_MATCH = /<td style=".*">(minecraft:.*)<\/td>/g
export const LINK_MATCH = /<a href="(#.*)">(.*)<\/a>/
export const STYLESHEET_MATCH = /<link rel="stylesheet".*href=".*prism\.css.*"><\/link>/
export const TEXTAREA_MATCH = /<textarea.*?>([^]*?)<\/textarea>/g
export const P_ID_MATCH = /<p id="(.*)">(.*)<\/p>/
export const H_TITLE_MATCH = new RegExp(`<h(\\d)>${P_ID_MATCH.source}<\\/h\\d>`, 'g')
export const ONLY_NEWLINES_AND_WHITESPACE = /^(?:\s*<\/?\s*br\s*\/?\s*>\s*)*$/
export const MARKDOWN_CODE_MATCH = /```([^]+)```/
