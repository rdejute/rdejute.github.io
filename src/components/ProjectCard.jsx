import { useLanguage } from '../context/LanguageContext'
import './ProjectCard.css'

// One project: image, name, tech tags, description. Reuses the glow treatment.
export default function ProjectCard({ nameKey, tech, descKey, image, imageAltKey }) {
  const { t } = useLanguage()
  return (
    <article className="project-card glow">
      <img className="project-card__image" src={image} alt={t(imageAltKey)} loading="lazy" />
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
