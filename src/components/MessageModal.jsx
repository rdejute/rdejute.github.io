import { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './MessageModal.css'

const FOCUSABLE = 'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'

// Full-message dialog. Closes on X, backdrop click, and Escape. Traps focus
// while open and returns focus to the trigger on close.
export default function MessageModal({ message, onClose }) {
  const { t, lang } = useLanguage()
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement
    const dialog = dialogRef.current
    const focusables = () => Array.from(dialog?.querySelectorAll(FOCUSABLE) ?? [])
    focusables()[0]?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const items = focusables()
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [onClose])

  const dateTime = new Date(message.created_at).toLocaleString(lang)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-modal-title"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <h2 id="message-modal-title" className="modal__title">
            {message.name}
          </h2>
          <button
            type="button"
            className="icon-btn modal__close"
            onClick={onClose}
            aria-label={t('backoffice.modal.close')}
          >
            <svg className="icon-btn__glyph" aria-hidden="true">
              <use href="/icons.svg#close-icon" />
            </svg>
          </button>
        </div>

        <p className="modal__meta">
          <a href={`mailto:${message.email}`}>{message.email}</a>
          <span className="modal__dot" aria-hidden="true">·</span>
          {dateTime}
        </p>

        <p className="modal__body">{message.message}</p>
      </div>
    </div>
  )
}
