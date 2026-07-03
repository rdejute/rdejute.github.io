import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

// Subtle magnetic pull: the element drifts a few px toward the cursor while
// hovered, then springs back on leave. Fine-pointer devices only, and disabled
// under reduced motion. Manipulates transform directly (no re-render).
export function useMagnetic(strength = 0.18) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let raf = 0
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
      })
    }
    const reset = () => {
      cancelAnimationFrame(raf)
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', reset)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', reset)
      el.style.transform = ''
    }
  }, [strength, reduced])

  return ref
}
