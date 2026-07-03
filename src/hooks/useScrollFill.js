import { useEffect, useRef } from 'react'

// Drives a 0→1 "fill" as the referenced element travels up through the viewport,
// written to --fill on the element itself (no React re-render). Used for the
// throughline / timeline lines that draw as you scroll past them. Under reduced
// motion the line is simply shown filled.
export function useScrollFill() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.style.setProperty('--fill', '1')
      return
    }

    let ticking = false
    const update = () => {
      ticking = false
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Start filling when the top passes 82% of the viewport; complete when the
      // element has scrolled up so its top sits near 38%.
      const start = vh * 0.82
      const end = vh * 0.38
      const raw = (start - rect.top) / (start - end)
      const fill = Math.min(1, Math.max(0, raw))
      el.style.setProperty('--fill', fill.toFixed(4))
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

  return ref
}
