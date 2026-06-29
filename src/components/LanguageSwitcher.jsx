import { useLanguage } from '../context/LanguageContext'
import './controls.css'

// Slot only — placement + basic EN/FR toggle. Translation loading and
// persistence live in languages.feature.md.
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage()
  const next = lang === 'en' ? 'fr' : 'en'
  return (
    <button
      type="button"
      className="control control--lang"
      onClick={() => setLang(next)}
      aria-label={t('controls.language')}
      title={t('controls.language')}
    >
      <svg className="control__icon" aria-hidden="true">
        <use href="/icons.svg#globe-icon" />
      </svg>
      <span className="control__text">{lang.toUpperCase()}</span>
    </button>
  )
}
