import Header from '../components/Header'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import { useScrollProgress } from '../hooks/useScrollProgress'
import './Main.css'

// The persistent shell wrapping every page: header on top, page content in
// <main>, footer below, plus the fixed mobile bottom-nav. An ambient warm light
// sits behind everything and drifts with scroll (--page-scroll). Each page is
// keyed so it rises in on navigation.
export default function Main({ current, onNavigate, children }) {
  useScrollProgress()

  return (
    <div className="layout">
      <div className="ambient-light" aria-hidden="true" />
      <Header current={current} onNavigate={onNavigate} />
      <main className="layout__main" id="main">
        <div className="page-enter" key={current}>
          {children}
        </div>
      </main>
      <Footer />
      <Nav current={current} onNavigate={onNavigate} variant="bottom" />
    </div>
  )
}
