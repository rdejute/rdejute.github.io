import Logo from './Logo'
import Nav from './Nav'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import './Header.css'

// Sticky header on every page: logo (→ Home), desktop top-nav, and the
// theme + language control slots (reachable on every page).
export default function Header({ current, onNavigate }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Logo onClick={() => onNavigate('home')} />
        <Nav current={current} onNavigate={onNavigate} variant="top" />
        <div className="site-header__controls">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
