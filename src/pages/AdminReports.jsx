import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'

export default function AdminReports() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchData()
  }, [])

  function fetchData() {
    setLoading(true)
    Promise.all([api.get('/admin/reports'), api.get('/admin/stats')])
      .then(function(res) { setReports(res[0].data); setStats(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function dismissReport(id) {
    if (!window.confirm('Dismiss this report?')) return
    api.delete('/admin/reports/' + id).then(fetchData).catch(function() { alert('Failed') })
  }

  function deleteListingAndReport(reportId, listingId) {
    if (!window.confirm('Delete this listing and dismiss the report?')) return
    api.delete('/admin/listings/' + listingId)
      .then(function() { return api.delete('/admin/reports/' + reportId) })
      .then(fetchData)
      .catch(function() { alert('Failed') })
  }

  const REASON_COLORS = {
    'Scam or fraud': { bg: '#fef2f2', color: '#dc2626', icon: '🚨' },
    'Fake listing': { bg: '#fffbeb', color: '#d97706', icon: '⚠️' },
    'Inappropriate content': { bg: '#fdf2f8', color: '#9d174d', icon: '🔞' },
    'Wrong price': { bg: '#eff6ff', color: '#1e40af', icon: '💰' },
    'Duplicate listing': { bg: '#f5f3ff', color: '#6d28d9', icon: '📋' },
    'Other': { bg: '#f9fafb', color: '#374151', icon: '❓' },
  }

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .ar-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .ar-empty-state {
          text-align: center; padding: 80px 20px;
          background: white; border-radius: 16px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
        }
        .ar-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .ar-empty-title { font-size: 18px; font-weight: 800; color: #08162F; margin-bottom: 6px; }
        .ar-empty-sub { font-size: 13px; color: #9ca3af; }

        .ar-grid { display: flex; flex-direction: column; gap: 14px; }

        .ar-card {
          background: white; border-radius: 16px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
          border-left: 4px solid #ef4444;
          overflow: hidden; transition: all 0.2s;
        }
        .ar-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }

        .ar-card-header {
          padding: 16px 20px 12px;
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 14px;
        }

        .ar-reason-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; padding: 4px 10px;
          border-radius: 8px; margin-bottom: 8px;
        }

        .ar-listing-title { font-size: 15px; font-weight: 800; color: #08162F; margin: 0 0 4px; }
        .ar-listing-sub { font-size: 12px; color: #9ca3af; margin: 0; }
        .ar-details {
          background: #f8fafc; border-radius: 8px; padding: 10px 14px;
          margin: 0 20px 14px; font-size: 13px; color: #6b7280;
          font-style: italic; border-left: 3px solid #e2e8f0;
        }

        .ar-card-footer {
          padding: 12px 20px;
          background: #fafbff;
          border-top: 1px solid #f1f5f9;
          display: flex; align-items: center;
          justify-content: space-between; gap: 10px; flex-wrap: wrap;
        }

        .ar-reporter {
          display: flex; align-items: center; gap: 8px;
        }
        .ar-reporter-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg,#08162F,#1e3a8a);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: white; font-weight: 800;
        }
        .ar-reporter-info { font-size: 12px; color: #6b7280; font-weight: 600; }

        .ar-actions { display: flex; gap: 8px; }
        .ar-btn {
          padding: 7px 14px; border-radius: 9px; font-size: 12px;
          font-weight: 700; cursor: pointer; font-family: inherit; border: 1.5px solid;
          transition: all 0.2s;
        }
        .ar-btn-dismiss { background: #ecfdf5; color: #059669; border-color: #bbf7d0; }
        .ar-btn-dismiss:hover { background: #d1fae5; }
        .ar-btn-delete { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
        .ar-btn-delete:hover { background: #fee2e2; }

        .ar-loading { text-align: center; padding: 60px 0; color: #9ca3af; }
      `}</style>

      <div className="ar-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">🚩 Reported Listings</h1>
          <p className="adm-page-sub">
            {reports.length} pending report{reports.length !== 1 ? 's' : ''} — review and take action
          </p>
        </div>

        {loading ? (
          <div className="ar-loading">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="ar-empty-state">
            <div className="ar-empty-icon">✅</div>
            <div className="ar-empty-title">All Clear!</div>
            <div className="ar-empty-sub">No pending reports. The platform is clean.</div>
          </div>
        ) : (
          <div className="ar-grid">
            {reports.map(function(r) {
              const style = REASON_COLORS[r.reason] || REASON_COLORS['Other']
              return (
                <div key={r._id} className="ar-card">
                  <div className="ar-card-header">
                    <div style={{ flex: 1 }}>
                      <div className="ar-reason-badge" style={{ background: style.bg, color: style.color }}>
                        {style.icon} {r.reason}
                      </div>
                      <p className="ar-listing-title">
                        {r.listing ? r.listing.title : '(Listing deleted)'}
                      </p>
                      <p className="ar-listing-sub">
                        Reported {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {r.details && (
                    <div className="ar-details">"{r.details}"</div>
                  )}

                  <div className="ar-card-footer">
                    <div className="ar-reporter">
                      <div className="ar-reporter-avatar">
                        {(r.reportedBy?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="ar-reporter-info">
                        Reported by {r.reportedBy?.name || 'Unknown User'}
                      </span>
                    </div>
                    <div className="ar-actions">
                      <button className="ar-btn ar-btn-dismiss" onClick={function() { dismissReport(r._id) }}>
                        ✓ Dismiss
                      </button>
                      {r.listing && (
                        <button className="ar-btn ar-btn-delete"
                          onClick={function() { deleteListingAndReport(r._id, r.listing._id) }}>
                          🗑️ Delete Listing
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}