import { useLanguage } from '../context/LanguageContext'
import { useTilt } from '../hooks/useTilt'
import ProgressiveImage from './ProgressiveImage'
import './ProjectCard.css'

// One project: image, name, tech tags, description. Tilts toward the cursor and
// blurs its image up on load; the cursor swells to a "view" disc over the media.
export default function ProjectCard({ nameKey, tech, descKey, image, imageAltKey }) {
  const { t } = useLanguage()
  const tiltRef = useTilt(4)
  return (
    <article ref={tiltRef} className="project-card glow">
      <ProgressiveImage
        className="project-card__image"
        src={image}
        alt={t(imageAltKey)}
        data-cursor-label="view"
      />
      <div className="project-card__body">
        <h3 className="project-card__name">{t(nameKey)}</h3>
        <ul className="project-card__tech">
          {tech.map((label) => (
            <li key={label} className="project-card__tag">{label}</li>
          ))}
        </ul>
        <p className="project-card__desc">{t(descKey)}</p>
      </div>
    </article>
  )
}
