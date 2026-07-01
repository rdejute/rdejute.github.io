import ProjectCard from './ProjectCard'
import Reveal from './Reveal'
import './ProjectGrid.css'

// Renders the project list; each card reveals on scroll, staggered ~80ms.
export default function ProjectGrid({ projects }) {
  return (
    <div className="project-grid">
      {projects.map((p, i) => (
        <Reveal key={p.key} className="project-grid__cell" delay={i * 80}>
          <ProjectCard
            nameKey={p.nameKey}
            tech={p.tech}
            descKey={p.descKey}
            image={p.image}
            imageAltKey={p.imageAltKey}
          />
        </Reveal>
      ))}
    </div>
  )
}
