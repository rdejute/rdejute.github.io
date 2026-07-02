import './FormField.css'

// Reusable labeled input/textarea with an error slot. Label is tied to the
// control via htmlFor/id; the error is linked with aria-describedby.
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
}) {
  const Tag = as
  const errorId = `${id}-error`
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <Tag
        id={id}
        className={`field__control${error ? ' field__control--error' : ''}`}
        {...(as === 'input' ? { type } : { rows: 6 })}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  )
}
