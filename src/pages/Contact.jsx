import contactImage from '../assets/contact-image.jpg'
import ContactForm from '../components/ContactForm'
import ProgressiveImage from '../components/ProgressiveImage'
import Reveal from '../components/Reveal'
import { useLanguage } from '../context/LanguageContext'
import './Contact.css'

// Contact page: intro + the validated form that inserts into Supabase, paired
// with a warm illustration that carries the "a message travels" motif.
// AI-generated graphic: src/assets/contact-image.png (tool: see docs/Research.md).
export default function Contact() {
  const { t } = useLanguage()
  return (
    <section className="home-section" aria-labelledby="contact-heading">
      <Reveal as="header" className="home-section__head">
        <h1 id="contact-heading">{t('contact.heading')}</h1>
        <p className="home-section__intro">{t('contact.intro')}</p>
        <p className="contact-badge">
          <span className="contact-badge__dot" aria-hidden="true" />
          {t('contact.replyBadge')}
        </p>
      </Reveal>

      <div className="contact-layout">
        <Reveal className="contact-layout__form">
          <ContactForm />
        </Reveal>

        <Reveal className="contact-layout__media">
          <div className="contact-media glow">
            <ProgressiveImage
              className="contact-media__img"
              src={contactImage}
              alt={t('contact.imageAlt')}
              width="1122"
              height="1402"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
