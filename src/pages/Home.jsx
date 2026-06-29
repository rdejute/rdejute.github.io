import { useLanguage } from '../context/LanguageContext'

// Placeholder — real content arrives in home-page.feature.md.
export default function Home() {
  const { t } = useLanguage()
  return (
    <section className="page">
      <h1>{t('pages.home.title')}</h1>
      <p>{t('pages.home.placeholder')}</p>
    </section>
  )
}
