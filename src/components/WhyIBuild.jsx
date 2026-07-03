import connectionGraphic from '../assets/connection-graphic.jpg'
import Reveal from './Reveal'
import ProgressiveImage from './ProgressiveImage'
import { useScrollFill } from '../hooks/useScrollFill'
import { useLanguage } from '../context/LanguageContext'
import './WhyIBuild.css'

// "Why I Build" — the human-services-to-developer testimony (home-page §2.C).
// A sage "throughline" draws down the left edge as the section scrolls past:
// the story's throughline, made literal. AI-generated graphic:
// src/assets/connection-graphic.png (tool: see docs/Research.md).
export default function WhyIBuild() {
  const { t } = useLanguage()
  const fillRef = useScrollFill()

  return (
    <section className="home-section home-section--alt glow why" aria-labelledby="why-heading">
      <span className="home-section__index" aria-hidden="true">02</span>
      <div className="why__inner" ref={fillRef}>
        <span className="why__thread" aria-hidden="true" />
        <Reveal className="why__text">
          <h2 id="why-heading">{t('home.why.heading')}</h2>
          <p>{t('home.why.body')}</p>
        </Reveal>
        <ProgressiveImage
          className="why__image"
          src={connectionGraphic}
          alt={t('home.why.imageAlt')}
          width="360"
          height="280"
        />
      </div>
    </section>
  )
}
