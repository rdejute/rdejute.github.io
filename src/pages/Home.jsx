import Hero from '../components/Hero'
import WhyIBuild from '../components/WhyIBuild'
import SkillGrid from '../components/SkillGrid'
import Reveal from '../components/Reveal'
import { TECHNICAL_SKILLS, SOFT_SKILLS } from '../data/skills'
import { useLanguage } from '../context/LanguageContext'
import './Home.css'

// Landing view: hero → technical skills → "Why I Build" testimony (second AI
// image) → "What I bring to a team". Sections alternate surfaces.
export default function Home({ onNavigate }) {
  const { t } = useLanguage()

  return (
    <>
      <Hero onNavigate={onNavigate} />

      <section className="home-section" aria-labelledby="tech-heading">
        <Reveal as="header" className="home-section__head">
          <h2 id="tech-heading">{t('home.tech.heading')}</h2>
          <p className="home-section__intro">{t('home.tech.intro')}</p>
        </Reveal>
        <SkillGrid skills={TECHNICAL_SKILLS} />
      </section>

      <WhyIBuild />

      <section className="home-section" aria-labelledby="soft-heading">
        <Reveal as="header" className="home-section__head">
          <h2 id="soft-heading">{t('home.soft.heading')}</h2>
          <p className="home-section__intro">{t('home.soft.intro')}</p>
        </Reveal>
        <SkillGrid skills={SOFT_SKILLS} />
      </section>
    </>
  )
}
