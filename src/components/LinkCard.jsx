import { useLanguage } from '../context/LanguageContext'
import './LinkCard.css'

// One curated link — a full-card anchor opening in a new tab. The media tile is
// an icon/logo by default, or an <img> when `image` is provided.
export default function LinkCard({ titleKey, descKey, url, icon, image, imageAltKey }) {
  const { t } = useLanguage()
  return (
    <a
      className="link-card glow"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t(titleKey)} — ${t('links.newTab')}`}
    >
      <span className="link-card__media">
        {image ? (
          <img className="link-card__img" src={image} alt={t(imageAltKey)} loading="lazy" />
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
