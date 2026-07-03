import { useScrollFill } from '../hooks/useScrollFill'
import './Timeline.css'

// Wraps a set of TimelineEntry rows with a sage rail on the left that draws
// itself as the list scrolls past (--fill via useScrollFill) — the same
// throughline motif, now tracing a career.
export default function Timeline({ children }) {
  const ref = useScrollFill()
  return (
    <div className="pf-timeline" ref={ref}>
      <span className="pf-timeline__rail" aria-hidden="true" />
      <div className="pf-timeline__entries">{children}</div>
    </div>
  )
}
