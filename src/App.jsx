import { useCallback, useEffect, useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useKonamiCode } from './hooks/useKonamiCode'
import Main from './layouts/Main'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Links from './pages/Links'
import Contact from './pages/Contact'
import Login from './pages/Login'
import BackOffice from './pages/BackOffice'

// Public views switch by app state so the URL stays at root (ai-spec §3.1).
// Secret views are reached only via the hash (#login/#backoffice) or the Konami
// code, and appear in no navigation.
const PAGES = {
  home: Home,
  portfolio: Portfolio,
  links: Links,
  contact: Contact,
  login: Login,
  backoffice: BackOffice,
}

const VIEW_BY_HASH = { '#login': 'login', '#backoffice': 'backoffice' }
const HASH_BY_VIEW = { login: '#login', backoffice: '#backoffice' }

const viewFromHash = () => VIEW_BY_HASH[window.location.hash] ?? 'home'

function AppRoutes() {
  const { session, loading } = useAuth()
  const [view, setView] = useState(viewFromHash)

  const navigate = useCallback((next) => {
    const hash = HASH_BY_VIEW[next]
    if (hash) {
      window.location.hash = hash // fires hashchange → setView
    } else if (window.location.hash) {
      // Clear the hash but keep the URL at root (no reload, no history entry).
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    setView(next)
  }, [])

  // Keep the view in sync when the hash changes (typed URL, back/forward).
  useEffect(() => {
    const onHashChange = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // A logged-in admin landing on #login goes straight to the Back Office.
  // Update the hash (not state) here; the hashchange listener syncs the view.
  useEffect(() => {
    if (session && view === 'login') {
      window.location.hash = HASH_BY_VIEW.backoffice
    }
  }, [session, view])

  // Konami code opens the login view from anywhere.
  useKonamiCode(useCallback(() => navigate('login'), [navigate]))

  // Guard the Back Office: no session → login (once the session check resolves).
  let guardedView = view
  if (view === 'backoffice' && !session) guardedView = loading ? 'loading' : 'login'

  const Page = PAGES[guardedView] ?? Home

  return (
    <Main current={guardedView} onNavigate={navigate}>
      {guardedView === 'loading' ? (
        <section className="home-section" aria-busy="true" />
      ) : (
        <Page onNavigate={navigate} />
      )}
    </Main>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
