import { useEffect, useRef, useState } from 'react'
import './CursorGlow.css'

const canRun = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

// A faint warm "presence" that trails the cursor — the brand's "the person on
// the other side feels seen" made literal. It swells over interactive elements,
// and can show a small contextual label via [data-cursor-label] (e.g. "view").
// Fine-pointer only; renders nothing under reduced motion or on touch.
export default function CursorGlow() {
  const dotRef = useRef(null)
  const [enabled] = useState(canRun)
  const [variant, setVariant] = useState('') // '', 'link', 'label'
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!enabled) return

    const dot = dotRef.current
    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y

    const render = () => {
      // Ease toward the target so the glow lags a touch — feels alive, not stuck.
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      if (dot) dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
    }
    const onOver = (e) => {
      const el = e.target.closest?.('[data-cursor-label], a, button')
      if (!el) {
        setVariant('')
        setLabel('')
        return
      }
      const l = el.getAttribute?.('data-cursor-label')
      if (l) {
        setVariant('label')
        setLabel(l)
      } else {
        setVariant('link')
        setLabel('')
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      className={`cursor-glow${variant ? ` cursor-glow--${variant}` : ''}`}
      aria-hidden="true"
    >
      {label && <span className="cursor-glow__label">{label}</span>}
    </div>
  )
}
