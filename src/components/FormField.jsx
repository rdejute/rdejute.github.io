import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './FormField.css'

// Reusable labeled input/textarea with an error slot. Label is tied to the
// control via htmlFor/id; the error is linked with aria-describedby.
// `revealable` adds a show/hide toggle (for password inputs).
export default function FormField({
  id,
  label,
  as = 'input',
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  revealable = false,
  float = false,
}) {
  const { t } = useLanguage()
  const [revealed, setRevealed] = useState(false)
  const Tag = as
  const errorId = `${id}-error`
  const canReveal = revealable && as === 'input'
  const inputType = canReveal && revealed ? 'text' : type
  // Floating label: the control keeps a blank placeholder so :placeholder-shown
  // reflects emptiness, and the label rides on top (see FormField.css).
  const useFloat = float && !canReveal

  const control = (
    <Tag
      id={id}
      className={`field__control${canReveal ? ' field__control--revealable' : ''}${error ? ' field__control--error' : ''}`}
      {...(as === 'input' ? { type: inputType } : { rows: 6 })}
      value={value}
      onChange={onChange}
      placeholder={useFloat ? ' ' : placeholder}
      autoComplete={autoComplete}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? errorId : undefined}
    />
  )

  const labelEl = (
    <label className="field__label" htmlFor={id}>
      {label}
    </label>
  )

  return (
    <div className={`field${useFloat ? ' field--float' : ''}`}>
      {useFloat ? (
        <div className="field__floatwrap">
          {control}
          {labelEl}
        </div>
      ) : canReveal ? (
        <>
          {labelEl}
          <div className="field__control-wrap">
            {control}
            <button
              type="button"
              className="field__reveal"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? t('field.hidePassword') : t('field.showPassword')}
              aria-pressed={revealed}
            >
              <svg className="field__reveal-icon" aria-hidden="true">
                <use href={`/icons.svg#${revealed ? 'eye-off-icon' : 'eye-icon'}`} />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <>
          {labelEl}
          {control}
        </>
      )}
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  )
}
