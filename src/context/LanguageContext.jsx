import { createContext, useContext, useState } from 'react'
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'

// Minimal language plumbing so no user-facing string is hardcoded (ai-spec §5).
// Persistence and the full switcher behavior live in languages.feature.md.
const dictionaries = { en, fr }
const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const dict = dictionaries[lang] ?? en

  // Resolve a dotted key path (e.g. "nav.home"); falls back to the key itself.
  const t = (key) =>
    key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict) ?? key

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
