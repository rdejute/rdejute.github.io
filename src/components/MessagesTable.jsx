import { useLanguage } from '../context/LanguageContext'
import './MessagesTable.css'

// Renders the messages as a table: Name, Email, Date, Actions.
export default function MessagesTable({ messages, onView, onDelete, deletingId, removingId }) {
  const { t, lang } = useLanguage()

  return (
    <div className="messages-table__wrap">
      <table className="messages-table">
        <thead>
          <tr>
            <th>{t('backoffice.cols.name')}</th>
            <th>{t('backoffice.cols.email')}</th>
            <th>{t('backoffice.cols.date')}</th>
            <th className="messages-table__actions-col">{t('backoffice.cols.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m, i) => (
            <tr
              key={m.id}
              className={`messages-table__row${i === 0 ? ' is-newest' : ''}${removingId === m.id ? ' is-removing' : ''}`}
              style={{ '--row-delay': `${Math.min(i, 8) * 45}ms` }}
            >
              <td>{m.name}</td>
              <td className="messages-table__email">{m.email}</td>
              <td>{new Date(m.created_at).toLocaleDateString(lang)}</td>
              <td>
                <div className="messages-table__actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => onView(m)}
                  >
                    {t('backoffice.view')}
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    onClick={() => onDelete(m.id)}
                    disabled={deletingId === m.id}
                    aria-label={`${t('backoffice.delete')} — ${m.name}`}
                  >
                    <svg className="icon-btn__glyph" aria-hidden="true">
                      <use href="/icons.svg#trash-icon" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
