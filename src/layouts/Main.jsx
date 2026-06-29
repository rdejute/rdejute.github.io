import Header from '../components/Header'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import './Main.css'

// The persistent shell wrapping every page: header on top, page content in
// <main>, footer below, plus the fixed mobile bottom-nav.
export default function Main({ current, onNavigate, children }) {
  return (
    <div className="layout">
      <Header current={current} onNavigate={onNavigate} />
      <main className="layout__main" id="main">
        {children}
      </main>
      <Footer />
      <Nav current={current} onNavigate={onNavigate} variant="bottom" />
    </div>
  )
}
