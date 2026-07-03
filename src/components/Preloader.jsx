import { useEffect, useState } from 'react'
import './Preloader.css'

// Shown once per page load; skipped under reduced motion. Module flag guards
// against a re-mount replaying the intro.
let introShown = false

const shouldPlay = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !introShown

// First-paint intro: the RD monogram ring draws itself and the room warms in.
export default function Preloader() {
  const [phase, setPhase] = useState(() => (shouldPlay() ? 'active' : 'gone'))

  useEffect(() => {
    if (phase !== 'active') return
    introShown = true
    document.body.classList.add('is-intro')

    const leave = setTimeout(() => setPhase('leaving'), 1150)
    const gone = setTimeout(() => {
      setPhase('gone')
      document.body.classList.remove('is-intro')
    }, 1750)
    return () => {
      clearTimeout(leave)
      clearTimeout(gone)
      document.body.classList.remove('is-intro')
    }
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div className={`preloader${phase === 'leaving' ? ' preloader--leaving' : ''}`} aria-hidden="true">
      <svg className="preloader__mark" viewBox="0 0 100 100" width="88" height="88">
        <circle className="preloader__ring" cx="50" cy="50" r="46" fill="none" strokeWidth="2" />
        <text className="preloader__initials" x="50" y="50" dominantBaseline="central" textAnchor="middle">
          RD
        </text>
      </svg>
    </div>
  )
}
