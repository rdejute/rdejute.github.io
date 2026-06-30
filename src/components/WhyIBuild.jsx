import connectionGraphic from '../assets/connection-graphic.png'
import Reveal from './Reveal'
import { useLanguage } from '../context/LanguageContext'
import './WhyIBuild.css'

// "Why I Build" — the human-services-to-developer testimony (home-page §2.C).
// AI-generated graphic: src/assets/connection-graphic.png (tool: see docs/Research.md).
export default function WhyIBuild() {
  const { t } = useLanguage()
  return (
    <section className="home-section home-section--alt glow why" aria-labelledby="why-heading">
      <Reveal className="why__inner">
        <div className="why__text">
          <h2 id="why-heading">{t('home.why.heading')}</h2>
          <p>{t('home.why.body')}</p>
        </div>
        <img
          className="why__image"
          src={connectionGraphic}
          alt={t('home.why.imageAlt')}
          width="360"
          height="280"
        />
      </Reveal>
    </section>
  )
}
