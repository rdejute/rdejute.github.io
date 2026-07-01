import { useLanguage } from '../context/LanguageContext'
import './ResumeDownload.css'

// Prominent résumé download. Real anchor with `download` semantics → the PDF
// served from public/resume.pdf.
export default function ResumeDownload() {
  const { t } = useLanguage()
  return (
    <a
      className="btn btn--primary resume-download"
      href="/resume.pdf"
      download="Raina_DeJute_Resume.pdf"
    >
      <svg className="resume-download__icon" aria-hidden="true">
        <use href="/icons.svg#download-icon" />
      </svg>
      {t('portfolio.resume')}
    </a>
  )
}
