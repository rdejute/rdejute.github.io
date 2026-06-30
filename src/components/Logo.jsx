import logoRd from '../assets/logo-rd.png'
import { useLanguage } from '../context/LanguageContext'
import './Logo.css'

// AI-generated personal logo — the "rd" monogram (src/assets/logo-rd.png).
// AI tool used: <DOCUMENT THE TOOL HERE, e.g. Midjourney / DALL·E> — this is a
// graded requirement (ai-spec §5, header-footer.feature §D).
export default function Logo({ onClick }) {
  const { t } = useLanguage()
  return (
    <button type="button" className="logo" onClick={onClick} aria-label={t('logo.alt')}>
      <span className="logo__ring">
        <img className="logo__img" src={logoRd} alt="" width="44" height="44" />
      </span>
    </button>
  )
}
