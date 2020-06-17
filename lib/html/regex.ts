// simple regex for matching tags in the html

export const H1_MATCH = /<h1>(.*)<\/h1>/
export const TABLE_MATCH = /<table .*>([^]*?)<\/table>/
export const TH_MATCH = /<th>(.*)<\/th>/
export const TD_MATCH = /<td style=".*">(minecraft:.*)<\/td>/g
export const LINK_MATCH = /<a href="(#.*)">(.*)<\/a>/
export const STYLESHEET_MATCH = /<link rel="stylesheet".*href=".*prism\.css.*"><\/link>/
export const TEXTAREA_MATCH = /<textarea.*?>([^]*?)<\/textarea>/g
