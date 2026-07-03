import { NAV_ITEMS } from './navItems'
import { useLanguage } from '../context/LanguageContext'
import './Nav.css'

// Shared nav for both placements. variant="top" → horizontal links in the
// header (desktop); variant="bottom" → fixed icon bar (mobile). Both render
// from NAV_ITEMS so they never drift out of sync.
export default function Nav({ current, onNavigate, variant = 'top' }) {
  const { t } = useLanguage()
  return (
    <nav className={`nav nav--${variant}`} aria-label={t('nav.aria')}>
      <ul className="nav__list">
        {NAV_ITEMS.map((item) => {
          const isActive = current === item.key
          return (
            <li key={item.key} className="nav__item">
              <button
                type="button"
                className={`nav__link${isActive ? ' nav__link--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate(item.key)}
              >
                <svg className="nav__icon" aria-hidden="true">
                  <use href={`/icons.svg#${item.icon}-icon`} />
                </svg>
                <span className="nav__label">{t(item.labelKey)}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
