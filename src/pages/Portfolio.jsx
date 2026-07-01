import TimelineEntry from '../components/TimelineEntry'
import ProjectGrid from '../components/ProjectGrid'
import ResumeDownload from '../components/ResumeDownload'
import Reveal from '../components/Reveal'
import { EDUCATION, WORK, PROJECTS } from '../data/portfolio'
import { useLanguage } from '../context/LanguageContext'
import './Portfolio.css'

// Résumé page: intro + download, Education, Work, Projects. Reuses the Home
// section shell (.home-section*), Reveal, and glow patterns.
export default function Portfolio() {
  const { t } = useLanguage()

  return (
    <>
      <section className="home-section pf-intro" aria-labelledby="pf-heading">
        <Reveal>
          <div className="pf-intro__top">
            <h1 id="pf-heading">{t('portfolio.heading')}</h1>
            <ResumeDownload />
          </div>
          <p className="home-section__intro">{t('portfolio.intro')}</p>
        </Reveal>
      </section>

      <section className="home-section home-section--alt" aria-labelledby="edu-heading">
        <Reveal as="header" className="home-section__head">
          <h2 id="edu-heading">{t('portfolio.education.heading')}</h2>
        </Reveal>
        <Reveal className="pf-timeline">
          {EDUCATION.map((e) => (
            <TimelineEntry key={e.key} titleKey={e.titleKey} orgKey={e.orgKey} datesKey={e.datesKey} />
          ))}
        </Reveal>
      </section>

      <section className="home-section home-section--alt" aria-labelledby="work-heading">
        <Reveal as="header" className="home-section__head">
          <h2 id="work-heading">{t('portfolio.work.heading')}</h2>
        </Reveal>
        <Reveal className="pf-timeline">
          {WORK.map((w) => (
            <TimelineEntry
              key={w.key}
              titleKey={w.titleKey}
              orgKey={w.orgKey}
              datesKey={w.datesKey}
              descKey={w.descKey}
            />
          ))}
        </Reveal>
      </section>

      <section className="home-section" aria-labelledby="proj-heading">
        <Reveal as="header" className="home-section__head">
          <h2 id="proj-heading">{t('portfolio.projects.heading')}</h2>
          <p className="home-section__intro">{t('portfolio.projects.intro')}</p>
        </Reveal>
        <ProjectGrid projects={PROJECTS} />
      </section>
    </>
  )
}
