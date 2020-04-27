import { useEffect } from 'react'

import { Router } from 'next/router'

const useScrollController = () => {
  useEffect(() => {
    const handleRouteChange = () => {}
    const handleRouteChangeComplete = () => {
      window.scrollTo(0, 0)
    }

    Router.events.on('routeChangeStart', handleRouteChange)
    Router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => {
      Router.events.off('routeChangeStart', handleRouteChange)
      Router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])
}

export { useScrollController }
