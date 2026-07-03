import { useLanguage } from '../context/LanguageContext'
import './TimelineEntry.css'

// One education or work entry: title, org, dates, and an optional description.
export default function TimelineEntry({ titleKey, orgKey, datesKey, descKey }) {
  const { t } = useLanguage()
  return (
    <article className="timeline-entry">
      <div className="timeline-entry__head">
        <h3 className="timeline-entry__title">{t(titleKey)}</h3>
        <span className="timeline-entry__dates">{t(datesKey)}</span>
      </div>
      {orgKey && <p className="timeline-entry__org">{t(orgKey)}</p>}
      {descKey && <p className="timeline-entry__desc">{t(descKey)}</p>}
    </article>
  )
}
