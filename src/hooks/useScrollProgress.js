import { useEffect } from 'react'

// Writes overall page scroll progress (0→1) to --page-scroll on <html>, so
// purely-visual consumers (the logo progress ring, the ambient background
// light) can react in CSS without re-rendering React. rAF-throttled.
export function useScrollProgress() {
  useEffect(() => {
    const root = document.documentElement
    let ticking = false

    const update = () => {
      ticking = false
      const max = root.scrollHeight - root.clientHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0
      root.style.setProperty('--page-scroll', ratio.toFixed(4))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}
