import { createContext, useContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

// Theme plumbing: holds the current theme and applies it via the data-theme
// attribute so tokens.css can switch palettes. Toggling performs a radial wipe
// of the new palette out from the switch (View Transitions API) — with a plain
// swap fallback where unsupported or when reduced motion is requested.
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Dark (espresso) is the default look; index.html also sets data-theme="dark"
  // on <html> so the very first paint is dark with no flash of the light theme.
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = (event) => {
    const next = theme === 'light' ? 'dark' : 'light'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!document.startViewTransition || reduced) {
      setTheme(next)
      return
    }

    // Grow the new palette from the click point.
    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? 0
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
        { duration: 560, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
