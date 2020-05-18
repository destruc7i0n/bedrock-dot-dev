import { MouseEvent } from 'react'

import debounce from 'debounce'
// @ts-ignore
import inView from 'element-in-view'

import { removeHashIfNeeded } from './util'

export const scrollTo = async (e: MouseEvent | null, id: string) => {
  if (e) e.preventDefault()

  const selector = document.getElementById(removeHashIfNeeded(id))

  if (selector) {
    // add the height of the header
    window.scrollTo({
      top: selector.offsetTop + 64
    })
  }
}

export const handleScroll = debounce((ids: string[]) => {
  for (let id of ids) {
    // remove the hash if there is
    id = removeHashIfNeeded(id)

    const heading = document.getElementById(id)
    if (heading && inView(heading, { offset: 58 })) {
      window.history.replaceState({}, '', `#${id}`)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
      break
    }
  }
}, 200)
