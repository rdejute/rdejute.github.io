import { useEffect, useRef, useState } from 'react'
import './ProgressiveImage.css'

// Blur-up image: mounts soft (blurred + slightly scaled) and resolves to sharp
// on load. Makes heavy imagery feel intentional instead of popping in — and
// keeps the class hooks the card CSS relies on (hover zoom, borders).
export default function ProgressiveImage({ className = '', ...props }) {
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)

  // Images already in cache may be complete before onLoad can attach.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  return (
    <img
      ref={ref}
      className={`progressive-img${loaded ? ' is-loaded' : ''} ${className}`.trim()}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      {...props}
    />
  )
}
