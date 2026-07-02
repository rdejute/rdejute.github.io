import { useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { useLanguage } from '../context/LanguageContext'
import FormField from './FormField'
import './ContactForm.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm() {
  const { t } = useLanguage()
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const timerRef = useRef(null)

  // Clear the auto-dismiss timer on unmount.
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const update = (field) => (e) => {
    const { value } = e.target
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    if (status) setStatus(null) // feedback dismisses on next interaction
  }

  const validate = () => {
    const errs = {}
    if (!values.name.trim()) errs.name = t('contact.errors.name')
    if (!EMAIL_RE.test(values.email.trim())) errs.email = t('contact.errors.email')
    if (!values.message.trim()) errs.message = t('contact.errors.message')
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Graceful fallback: never attempt an insert without a configured client.
    if (!isSupabaseConfigured || !supabase) return

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    setStatus(null)
    const { error } = await supabase.from('messages').insert({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    })
    setSubmitting(false)

    if (error) {
      setStatus('error') // keep field values so they can retry
    } else {
      setStatus('success')
      setValues({ name: '', email: '', message: '' })
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setStatus(null), 6000)
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <FormField
        id="cf-name"
        label={t('contact.name.label')}
        placeholder={t('contact.name.placeholder')}
        value={values.name}
        onChange={update('name')}
        error={errors.name}
        autoComplete="name"
      />
      <FormField
        id="cf-email"
        type="email"
        label={t('contact.email.label')}
        placeholder={t('contact.email.placeholder')}
        value={values.email}
        onChange={update('email')}
        error={errors.email}
        autoComplete="email"
      />
      <FormField
        id="cf-message"
        as="textarea"
        label={t('contact.message.label')}
        placeholder={t('contact.message.placeholder')}
        value={values.message}
        onChange={update('message')}
        error={errors.message}
      />

      {!isSupabaseConfigured && <p className="form-note">{t('contact.unavailable')}</p>}

      <div aria-live="polite">
        {status === 'success' && (
          <div className="form-status form-status--success" role="status">
            <svg className="form-status__icon" aria-hidden="true">
              <use href="/icons.svg#check-icon" />
            </svg>
            <span>{t('contact.feedback.success')}</span>
          </div>
        )}
        {status === 'error' && (
          <div className="form-status form-status--error" role="alert">
            <svg className="form-status__icon" aria-hidden="true">
              <use href="/icons.svg#close-icon" />
            </svg>
            <span>{t('contact.feedback.error')}</span>
          </div>
        )}
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting || !isSupabaseConfigured}>
        {submitting ? t('contact.sending') : t('contact.submit')}
      </button>
    </form>
  )
}
