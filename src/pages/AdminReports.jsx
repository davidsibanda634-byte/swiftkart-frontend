import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AdminLayout } from './AdminDashboard'
import api from '../services/api'

export default function AdminReports() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchAll()
  }, [])

  function fetchAll() {
    setLoading(true)
    Promise.all([
      api.get('/admin/reports'),
      api.get('/admin/stats'),
    ])
      .then(function([r, s]) { setReports(r.data); setStats(s.data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function dismissReport(id) {
    if (!window.confirm('Dismiss this report?')) return
    api.delete('/admin/reports/' + id)
      .then(function() { fetchAll() })
      .catch(function() { alert('Failed to dismiss.') })
  }

  function deleteListingAndReport(reportId, listingId) {
    if (!window.confirm('Delete this listing AND dismiss the report?')) return
    api.delete('/admin/listings/' + listingId)
      .then(function() { return api.delete('/admin/reports/' + reportId) })
      .then(function() { fetchAll() })
      .catch(function() { alert('Failed to delete listing.') })
  }

  const REASONS = ['All', 'Scam or fraud', 'Fake listing', 'Inappropriate content', 'Wrong price', 'Duplicate listing', 'Other']

  const filtered = reports.filter(r => filter === 'all' || r.reason === filter)

  return (
    <AdminLayout stats={stats}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">🚩 Reported Listings</h1>
        <p className="adm-page-sub">{reports.length} pending report{reports.length !== 1 ? 's' : ''} awaiting review</p>
      </div>

      {reports.length > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <p style={{ margin: 0, fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>
            {reports.length} report{reports.length !== 1 ? 's' : ''} need your attention
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {REASONS.map(r => (
          <button
            key={r}
            onClick={() => setFilter(r === 'All' ? 'all' : r)}
            style={{
              padding: '6px 13px', borderRadius: '20px', border: '1.5px solid',
              borderColor: (filter === 'all' && r === 'All') || filter === r ? '#ef4444' : '#e2e8f0',
              background: (filter === 'all' && r === 'All') || filter === r ? '#fef2f2' : 'white',
              color: (filter === 'all' && r === 'All') || filter === r ? '#dc2626' : '#374151',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >{r}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>Loading reports...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
          <p style={{ fontSize: '44px', margin: '0 0 12px' }}>✅</p>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#374151', margin: '0 0 6px' }}>All clear!</p>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>No pending reports matching this filter</p>
        </div>
      ) : (
        <div className="adm-section">
          {filtered.map(function(r) {
            return (
              <div key={r._id} className="adm-row-item" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, marginTop: '2px' }}>
                  🚩
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                    {r.listing ? r.listing.title : '(Listing already deleted)'}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '12px', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1px 8px', borderRadius: '8px' }}>
                      {r.reason}
                    </span>
                  </p>
                  {r.details && (
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                      "{r.details}"
                    </p>
                  )}
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af' }}>
                    Reported by {r.reportedBy?.name || 'Unknown'} •{' '}
                    {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => dismissReport(r._id)} style={{
                    background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                    padding: '6px 14px', borderRadius: '8px', fontSize: '11px',
                    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}>✓ Dismiss</button>
                  {r.listing && (
                    <button onClick={() => deleteListingAndReport(r._id, r.listing._id)} style={{
                      background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                      padding: '6px 14px', borderRadius: '8px', fontSize: '11px',
                      fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                    }}>🗑️ Delete Listing</button>
                  )}
                  {r.listing && (
                    <button onClick={() => navigate('/listings/' + r.listing._id)} style={{
                      background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0',
                      padding: '6px 14px', borderRadius: '8px', fontSize: '11px',
                      fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                    }}>👁️ View</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}