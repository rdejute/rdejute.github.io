import { useEffect, useRef } from 'react'

// The sequence lives in one place so it's trivial to change/disable.
export const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

// Global keydown listener; calls onUnlock when the full sequence is entered.
// Ignores keys while typing in a field, and resets on a wrong key.
export function useKonamiCode(onUnlock) {
  const index = useRef(0)
  const onUnlockRef = useRef(onUnlock)
  useEffect(() => {
    onUnlockRef.current = onUnlock
  }, [onUnlock])

  useEffect(() => {
    const handler = (e) => {
      const el = e.target
      if (el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable) return

      // Letters compared case-insensitively; arrow keys stay as-is.
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key

      if (key === KONAMI_CODE[index.current]) {
        index.current += 1
        if (index.current === KONAMI_CODE.length) {
          index.current = 0
          onUnlockRef.current?.()
        }
      } else {
        // Reset — but let this key start a fresh sequence if it's the first one.
        index.current = key === KONAMI_CODE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Optional breadcrumb so an evaluator poking in dev tools finds the easter egg.
  useEffect(() => {
    console.log(
      '%c↑ ↑ ↓ ↓ ← → ← → B A',
      'color:#7E9A78;font-weight:600',
      '— there is a door for those who know the code.',
    )
  }, [])
}
