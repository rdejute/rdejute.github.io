import { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import FormField from '../components/FormField'
import './Login.css'

// Secret admin login (reached via #login or the Konami code). On success the
// session is set and we navigate to the Back Office. A failed attempt gives a
// gentle shake — even the error state stays kind.
export default function Login({ onNavigate }) {
  const { t } = useLanguage()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const shakeTimer = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    const { error: authError } = await signIn(email, password)
    setSubmitting(false)
    if (authError) {
      setError(true)
      setShaking(true)
      clearTimeout(shakeTimer.current)
      shakeTimer.current = setTimeout(() => setShaking(false), 500)
    } else {
      onNavigate('backoffice')
    }
  }

  return (
    <section className="home-section login" aria-labelledby="login-heading">
      <div className={`login__card${shaking ? ' shake' : ''}`}>
        <h1 id="login-heading" className="login__title">
          {t('login.heading')}
        </h1>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <FormField
            id="login-email"
            type="email"
            label={t('login.email.label')}
            placeholder={t('login.email.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <FormField
            id="login-password"
            type="password"
            label={t('login.password.label')}
            placeholder={t('login.password.placeholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            revealable
          />

          <div aria-live="polite">
            {error && (
              <div className="form-status form-status--error" role="alert">
                <svg className="form-status__icon" aria-hidden="true">
                  <use href="/icons.svg#close-icon" />
                </svg>
                <span>{t('login.error')}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn--primary login__submit" disabled={submitting}>
            {submitting ? t('login.submitting') : t('login.submit')}
          </button>
        </form>
      </div>
    </section>
  )
}
