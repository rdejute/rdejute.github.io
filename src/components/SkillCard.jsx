import { useLanguage } from '../context/LanguageContext'
import { useMagnetic } from '../hooks/useMagnetic'
import './SkillCard.css'

// One skill: icon + title + supporting sentence. Reused by both skill grids.
// The card drifts subtly toward the cursor (magnetic) on fine-pointer devices.
export default function SkillCard({ icon, titleKey, descKey }) {
  const { t } = useLanguage()
  const magneticRef = useMagnetic(0.12)
  return (
    <article ref={magneticRef} className="skill-card glow">
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
