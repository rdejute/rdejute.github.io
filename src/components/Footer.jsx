import { useLanguage } from '../context/LanguageContext'
import './Footer.css'

// Contact + social + copyright, on every page. Secret routes never appear here.
const EMAIL = 'rainadejute@gmail.com'
const SOCIALS = [
  // TODO: replace the LinkedIn URL with Raina's real profile.
  { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/rdejute', icon: 'social-linkedin' },
  { key: 'github', label: 'GitHub', url: 'https://github.com/rdejute', icon: 'social-github' },
]

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__tagline">{t('footer.tagline')}</p>

        <div className="site-footer__groups">
          <div className="site-footer__group">
            <h2 className="site-footer__heading">{t('footer.contactHeading')}</h2>
            <a className="site-footer__email" href={`mailto:${EMAIL}`} aria-label={t('footer.emailLabel')}>
              {EMAIL}
            </a>
          </div>

          <div className="site-footer__group">
            <h2 className="site-footer__heading">{t('footer.social')}</h2>
            <ul className="site-footer__socials">
              {SOCIALS.map((s) => (
                <li key={s.key}>
                  <a
                    className="site-footer__social"
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                  >
                    <svg className="site-footer__icon" aria-hidden="true">
                      <use href={`/icons.svg#${s.icon}`} />
                    </svg>
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="site-footer__copy">
          © {year} Raina DeJute. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
