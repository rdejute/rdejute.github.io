import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import MessagesTable from '../components/MessagesTable'
import MessageModal from '../components/MessageModal'
import './BackOffice.css'

// Auth-gated admin dashboard. The App-level guard only renders this with a
// valid session; here we fetch, view, delete messages, and log out.
export default function BackOffice({ onNavigate }) {
  const { t } = useLanguage()
  const { session, signOut } = useAuth()
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState(() => (supabase ? 'loading' : 'error'))
  const [selected, setSelected] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (error) setStatus('error')
        else {
          setMessages(data ?? [])
          setStatus('ready')
        }
      })
    return () => {
      active = false
    }
  }, [])

  const handleDelete = async (id) => {
    setDeletingId(id)
    const { error } = await supabase.from('messages').delete().eq('id', id)
    setDeletingId(null)
    if (error) return
    // Collapse the row out before dropping it from state (respects the admin's
    // spatial memory instead of a jarring vanish).
    setRemovingId(id)
    setTimeout(() => {
      setMessages((rows) => rows.filter((r) => r.id !== id))
      setSelected((sel) => (sel?.id === id ? null : sel))
      setRemovingId(null)
    }, 320)
  }

  const handleLogout = async () => {
    await signOut()
    onNavigate('home')
  }

  return (
    <section className="home-section backoffice" aria-labelledby="bo-heading">
      <div className="backoffice__head">
        <div>
          <h1 id="bo-heading">{t('backoffice.heading')}</h1>
          {session?.user?.email && (
            <p className="backoffice__subtitle">
              {t('backoffice.signedInAs')} <strong>{session.user.email}</strong>
            </p>
          )}
        </div>
        <button type="button" className="btn btn--ghost" onClick={handleLogout}>
          {t('backoffice.logout')}
        </button>
      </div>

      {status === 'loading' && (
        <>
          <p className="sr-only" role="status">{t('backoffice.loading')}</p>
          <div className="messages-table__wrap bo-skeleton" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="bo-skeleton__row" key={i}>
                <span className="skeleton bo-skeleton__cell" />
                <span className="skeleton bo-skeleton__cell" />
                <span className="skeleton bo-skeleton__cell" />
              </div>
            ))}
          </div>
        </>
      )}

      {status === 'error' && (
        <div className="form-status form-status--error" role="alert">
          <svg className="form-status__icon" aria-hidden="true">
            <use href="/icons.svg#close-icon" />
          </svg>
          <span>{t('backoffice.error')}</span>
        </div>
      )}

      {status === 'ready' && messages.length === 0 && (
        <div className="backoffice__empty">
          <svg className="backoffice__empty-icon" aria-hidden="true">
            <use href="/icons.svg#chat-icon" />
          </svg>
          <p className="backoffice__note">{t('backoffice.empty')}</p>
        </div>
      )}

      {status === 'ready' && messages.length > 0 && (
        <MessagesTable
          messages={messages}
          onView={setSelected}
          onDelete={handleDelete}
          deletingId={deletingId}
          removingId={removingId}
        />
      )}

      {selected && <MessageModal message={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
