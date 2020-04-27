import { MouseEvent } from 'react'

import Router from 'next/router'

export const scrollTo = async (e: MouseEvent | null, id: string) => {
  if (e) e.preventDefault()
  const selector = document.getElementById(id.replace('#', ''))

  if (selector) {
    const { slug } = Router.query
    if (slug && typeof slug === 'object') {
      const base = `/docs/${slug.join('/')}`

      await Router.replace('/docs/[...slug]', base + id, { shallow: true })
    }

    // add the height of the header
    window.scrollTo(0, selector.offsetTop + 64)
  }
}
