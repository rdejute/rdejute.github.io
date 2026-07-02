import ContactForm from '../components/ContactForm'
import Reveal from '../components/Reveal'
import { useLanguage } from '../context/LanguageContext'

// Contact page: intro + the validated form that inserts into Supabase.
export default function Contact() {
  const { t } = useLanguage()
  return (
    <section className="home-section" aria-labelledby="contact-heading">
      <Reveal as="header" className="home-section__head">
        <h1 id="contact-heading">{t('contact.heading')}</h1>
        <p className="home-section__intro">{t('contact.intro')}</p>
      </Reveal>
      <Reveal>
        <ContactForm />
      </Reveal>
    </section>
  )
}
