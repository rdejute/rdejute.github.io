import { useLanguage } from '../context/LanguageContext'

// Placeholder — real content arrives in portfolio-page.feature.md.
export default function Portfolio() {
  const { t } = useLanguage()
  return (
    <section className="page">
      <h1>{t('pages.portfolio.title')}</h1>
      <p>{t('pages.portfolio.placeholder')}</p>
    </section>
  )
}
