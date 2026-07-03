import portrait from '../assets/headshot.jpg'
import { useLanguage } from '../context/LanguageContext'
import './Hero.css'

// AI-generated portrait: src/assets/headshot.png.
// AI tool used: <DOCUMENT THE TOOL> — see docs/Research.md (graded requirement).
const CHIP_KEYS = ['a', 'b', 'c']

export default function Hero({ onNavigate }) {
  const { t } = useLanguage()
  return (
    <section className="hero">
      <div className="hero__content">
        <p className="hero__eyebrow rise-in" style={{ '--rise-delay': '0ms' }}>{t('home.eyebrow')}</p>
        <h1 className="hero__name focus-in" style={{ '--rise-delay': '90ms' }}>{t('home.name')}</h1>
        <p className="hero__role rise-in" style={{ '--rise-delay': '230ms' }}>{t('home.role')}</p>
        <p className="hero__tagline rise-in" style={{ '--rise-delay': '300ms' }}>{t('home.tagline')}</p>
        <p className="hero__intro rise-in" style={{ '--rise-delay': '360ms' }}>{t('home.intro')}</p>

        <div className="hero__ctas rise-in" style={{ '--rise-delay': '440ms' }}>
          <button type="button" className="btn btn--primary" onClick={() => onNavigate('portfolio')}>
            {t('home.ctaWork')} <span className="btn__arrow" aria-hidden="true">→</span>
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => onNavigate('contact')}>
            {t('home.ctaContact')}
          </button>
        </div>

        <ul className="hero__chips rise-in" style={{ '--rise-delay': '520ms' }}>
          {CHIP_KEYS.map((c) => (
            <li key={c} className="hero__chip">{t(`home.chips.${c}`)}</li>
          ))}
        </ul>
      </div>

      <div className="hero__media rise-in" style={{ '--rise-delay': '200ms' }}>
        <div className="hero__portrait-frame glow">
          <div className="hero__portrait-clip">
            <img
              className="hero__portrait"
              src={portrait}
              alt={t('home.portraitAlt')}
              width="440"
              height="540"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
