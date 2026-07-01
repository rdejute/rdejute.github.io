import LinkCard from '../components/LinkCard'
import Reveal from '../components/Reveal'
import { LINKS } from '../data/links'
import { useLanguage } from '../context/LanguageContext'
import './Links.css'

// Links page: curated profiles + a couple of "sites I value", as link cards
// that open in a new tab. Reuses the section shell, Reveal, and glow patterns.
export default function Links() {
  const { t } = useLanguage()

  return (
    <section className="home-section" aria-labelledby="links-heading">
      <Reveal as="header" className="home-section__head">
        <h1 id="links-heading">{t('links.heading')}</h1>
        <p className="home-section__intro">{t('links.intro')}</p>
      </Reveal>

      <div className="link-grid">
        {LINKS.map((l, i) => (
          <Reveal key={l.key} className="link-grid__cell" delay={i * 70}>
            <LinkCard
              titleKey={l.titleKey}
              descKey={l.descKey}
              url={l.url}
              icon={l.icon}
              image={l.image}
              imageAltKey={l.imageAltKey}
            />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
