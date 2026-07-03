import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import './controls.css'

// Slot only — placement + basic toggle. Full behavior (OS default, persistence,
// transitions) lives in light-dark-mode.feature.md.
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      className="control"
      onClick={(e) => toggleTheme(e)}
      aria-label={t('controls.theme')}
      aria-pressed={isDark}
      title={t('controls.theme')}
    >
      <svg className="control__icon" aria-hidden="true">
        <use href={`/icons.svg#${isDark ? 'sun' : 'moon'}-icon`} />
      </svg>
    </button>
  )
}
