import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

// Placeholder — the message table/view/delete arrive in the Back Office feature.
// This exists now as the authenticated destination for Login, with a logout.
export default function BackOffice({ onNavigate }) {
  const { t } = useLanguage()
  const { session, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    onNavigate('home')
  }

  return (
    <section className="home-section" aria-labelledby="bo-heading">
      <h1 id="bo-heading">{t('backoffice.heading')}</h1>
      <p className="home-section__intro">{t('backoffice.placeholder')}</p>
      {session?.user?.email && (
        <p>
          {t('backoffice.signedInAs')} <strong>{session.user.email}</strong>
        </p>
      )}
      <button type="button" className="btn btn--ghost" onClick={handleLogout}>
        {t('backoffice.logout')}
      </button>
    </section>
  )
}
