import portrait from '../assets/headshot.png'
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
        <p className="hero__eyebrow">{t('home.eyebrow')}</p>
        <h1 className="hero__name">{t('home.name')}</h1>
        <p className="hero__role">{t('home.role')}</p>
        <p className="hero__tagline">{t('home.tagline')}</p>
        <p className="hero__intro">{t('home.intro')}</p>

        <div className="hero__ctas">
          <button type="button" className="btn btn--primary" onClick={() => onNavigate('portfolio')}>
            {t('home.ctaWork')} <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => onNavigate('contact')}>
            {t('home.ctaContact')}
          </button>
        </div>

        <ul className="hero__chips">
          {CHIP_KEYS.map((c) => (
            <li key={c} className="hero__chip">{t(`home.chips.${c}`)}</li>
          ))}
        </ul>
      </div>

      <div className="hero__media">
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
