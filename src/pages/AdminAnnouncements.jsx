import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'

export default function AdminAnnouncements() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')
  const [sent, setSent] = useState(false)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    api.get('/admin/stats').then(function(res) { setStats(res.data) }).catch(function() {})
  }, [user])

  function handleSend(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(function() { setSent(false); setTitle(''); setMessage('') }, 3000)
  }

  const TYPE_STYLES = {
    info: { bg: '#eff6ff', color: '#1e40af', icon: 'ℹ️' },
    success: { bg: '#ecfdf5', color: '#059669', icon: '✅' },
    warning: { bg: '#fffbeb', color: '#d97706', icon: '⚠️' },
    danger: { bg: '#fef2f2', color: '#dc2626', icon: '🚨' },
  }

  const inp = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e8ecf4',
    borderRadius: '11px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s'
  }

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .ann-panel { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
        .ann-label { display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .ann-field { margin-bottom: 16px; }
        .ann-type-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
        .ann-type-btn { padding: 7px 16px; border-radius: 20px; border: 1.5px solid #e8ecf4; background: white; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .ann-type-btn.active { border-color: #00C896; background: #ecfdf5; color: #059669; }
        .ann-preview { border-radius: 12px; padding: 16px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 12px; }
        .ann-submit { background: linear-gradient(135deg,#00C896,#059669); color: white; border: none; padding: 13px; border-radius: 11px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: inherit; width: 100%; transition: all 0.2s; }
        .ann-submit:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .ann-success { background: #ecfdf5; border: 1px solid #bbf7d0; color: #16a34a; padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-bottom: 16px; text-align: center; }
      `}</style>

      <div className="adm-page-header">
        <h1 className="adm-page-title">📢 Announcements</h1>
        <p className="adm-page-sub">Send platform-wide announcements to all users</p>
      </div>

      <div className="ann-panel">
        {sent && <div className="ann-success">✅ Announcement sent successfully to all users!</div>}

        <form onSubmit={handleSend}>
          <div className="ann-field">
            <label className="ann-label">Announcement Type</label>
            <div className="ann-type-row">
              {Object.keys(TYPE_STYLES).map(function(t) {
                return (
                  <button key={t} type="button"
                    className={'ann-type-btn' + (type === t ? ' active' : '')}
                    onClick={function() { setType(t) }}>
                    {TYPE_STYLES[t].icon} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="ann-field">
            <label className="ann-label">Title *</label>
            <input
              style={inp}
              placeholder="Announcement title..."
              value={title}
              onChange={function(e) { setTitle(e.target.value) }}
              required
              onFocus={function(e) { e.target.style.borderColor = '#00C896' }}
              onBlur={function(e) { e.target.style.borderColor = '#e8ecf4' }}
            />
          </div>

          <div className="ann-field">
            <label className="ann-label">Message *</label>
            <textarea
              style={{ ...inp, resize: 'vertical' }}
              rows={4}
              placeholder="Write your announcement message..."
              value={message}
              onChange={function(e) { setMessage(e.target.value) }}
              required
              onFocus={function(e) { e.target.style.borderColor = '#00C896' }}
              onBlur={function(e) { e.target.style.borderColor = '#e8ecf4' }}
            />
          </div>

          {(title || message) && (
            <div className="ann-field">
              <label className="ann-label">Preview</label>
              <div className="ann-preview" style={{ background: TYPE_STYLES[type].bg }}>
                <span style={{ fontSize: '20px' }}>{TYPE_STYLES[type].icon}</span>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: TYPE_STYLES[type].color, margin: '0 0 4px' }}>{title || 'Announcement Title'}</p>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{message || 'Your message will appear here...'}</p>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="ann-submit">
            📢 Send Announcement to All Users
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}