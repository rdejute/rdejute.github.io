import { useLanguage } from '../context/LanguageContext'

// Placeholder — real content arrives in link-page.feature.md.
export default function Links() {
  const { t } = useLanguage()
  return (
    <section className="page">
      <h1>{t('pages.links.title')}</h1>
      <p>{t('pages.links.placeholder')}</p>
    </section>
  )
}
