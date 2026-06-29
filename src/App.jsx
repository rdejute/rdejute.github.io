import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Main from './layouts/Main'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Links from './pages/Links'
import Contact from './pages/Contact'

// The four public views are switched by app-level state, so the URL stays at
// the root (ai-spec §3.1). Secret routes (Login, Back Office) are handled in
// their own features and never appear in navigation.
const PAGES = {
  home: Home,
  portfolio: Portfolio,
  links: Links,
  contact: Contact,
}

function App() {
  const [view, setView] = useState('home')
  const Page = PAGES[view] ?? Home

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Main current={view} onNavigate={setView}>
          <Page />
        </Main>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
