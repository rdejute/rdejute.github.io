import { useLanguage } from '../context/LanguageContext'
import ProgressiveImage from './ProgressiveImage'
import './LinkCard.css'

// One curated link — a full-card anchor opening in a new tab. The media tile is
// an icon/logo by default, or an <img> when `image` is provided. A soft sage
// sheen pools toward the cursor (--mx/--my) while hovered.
export default function LinkCard({ titleKey, descKey, url, icon, image, imageAltKey }) {
  const { t } = useLanguage()

  const onMove = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`)
  }

  return (
    <a
      className="link-card glow"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t(titleKey)} — ${t('links.newTab')}`}
      onMouseMove={onMove}
    >
      <span className="link-card__media">
        {image ? (
          <ProgressiveImage className="link-card__img" src={image} alt={t(imageAltKey)} />
        ) : (
          <svg className="link-card__icon" aria-hidden="true">
            <use href={`/icons.svg#${icon}`} />
          </svg>
        )}
      </span>
      <span className="link-card__body">
        <span className="link-card__titlerow">
          <span className="link-card__title">{t(titleKey)}</span>
          <svg className="link-card__external" aria-hidden="true">
            <use href="/icons.svg#external-icon" />
          </svg>
        </span>
        <span className="link-card__desc">{t(descKey)}</span>
      </span>
    </a>
  )
}
