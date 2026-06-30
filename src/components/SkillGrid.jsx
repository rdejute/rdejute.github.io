import SkillCard from './SkillCard'
import Reveal from './Reveal'
import './SkillGrid.css'

// Reusable responsive grid. Each card is wrapped in Reveal so it fades-and-rises
// on scroll, staggered ~75ms per card. The card itself handles glow + hover lift.
export default function SkillGrid({ skills }) {
  return (
    <div className="skill-grid">
      {skills.map((s, i) => (
        <Reveal key={s.key} className="skill-grid__cell" delay={i * 75}>
          <SkillCard icon={s.icon} titleKey={s.titleKey} descKey={s.descKey} />
        </Reveal>
      ))}
    </div>
  )
}
