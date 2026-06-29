import { useLanguage } from '../context/LanguageContext'

// Placeholder — real content arrives in contact-page.feature.md.
export default function Contact() {
  const { t } = useLanguage()
  return (
    <section className="page">
      <h1>{t('pages.contact.title')}</h1>
      <p>{t('pages.contact.placeholder')}</p>
    </section>
  )
}
