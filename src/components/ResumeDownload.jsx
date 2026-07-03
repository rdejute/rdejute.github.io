import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './ResumeDownload.css'

// Prominent résumé download. Real anchor with `download` semantics → the PDF
// served from public/resume.pdf. On click the icon morphs to a check for a beat
// as a small confirmation the download started.
export default function ResumeDownload() {
  const { t } = useLanguage()
  const [done, setDone] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleClick = () => {
    setDone(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), 1900)
  }

  return (
    <a
      className={`btn btn--primary resume-download${done ? ' is-done' : ''}`}
      href="/resume.pdf"
      download="Raina_DeJute_Resume.pdf"
      onClick={handleClick}
    >
      <svg className="resume-download__icon" aria-hidden="true">
        <use href={`/icons.svg#${done ? 'check' : 'download'}-icon`} />
      </svg>
      {t('portfolio.resume')}
    </a>
  )
}
