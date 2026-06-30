import { useLanguage } from '../context/LanguageContext'
import './SkillCard.css'

// One skill: icon + title + supporting sentence. Reused by both skill grids
// (and reusable by the Portfolio page for project cards).
export default function SkillCard({ icon, titleKey, descKey }) {
  const { t } = useLanguage()
  return (
    <article className="skill-card glow">
      <span className="skill-card__icon" aria-hidden="true">
        <svg className="skill-card__glyph">
          <use href={`/icons.svg#${icon}-icon`} />
        </svg>
      </span>
      <h3 className="skill-card__title">{t(titleKey)}</h3>
      <p className="skill-card__desc">{t(descKey)}</p>
    </article>
  )
}
