import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function AdminReports() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchReports()
  }, [])

  function fetchReports() {
    setLoading(true)
    api.get('/admin/reports')
      .then(function(res) { setReports(res.data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function dismissReport(id) {
    if (!window.confirm('Dismiss this report?')) return
    api.delete('/admin/reports/' + id)
      .then(function() { fetchReports() })
      .catch(function() { alert('Failed to dismiss report.') })
  }

  function deleteListingAndReport(reportId, listingId) {
    if (!window.confirm('Delete this listing AND dismiss the report?')) return
    api.delete('/admin/listings/' + listingId)
      .then(function() { return api.delete('/admin/reports/' + reportId) })
      .then(function() { fetchReports() })
      .catch(function() { alert('Failed to delete listing.') })
  }

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 80px' }}>

      <button
        onClick={function() { navigate('/admin') }}
        style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', color: '#374151', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', fontWeight: 600 }}
      >← Back to Dashboard</button>

      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#08162F', marginBottom: '4px' }}>🚩 Reported Listings</h1>
      <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>{reports.length} pending reports</p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>Loading reports...</p>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>✅</p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>No pending reports. Everything looks clean!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reports.map(function(r) {
            return (
              <div key={r._id} style={{
                background: 'white', borderRadius: '14px', padding: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1px solid #fecaca'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>
                      {r.listing ? r.listing.title : '(Listing deleted)'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, margin: '4px 0' }}>
                      Reason: {r.reason}
                    </p>
                    {r.details && (
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
                        "{r.details}"
                      </p>
                    )}
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>
                      Reported by {r.reportedBy?.name || 'Unknown'} • {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={function() { dismissReport(r._id) }} style={{
                      background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                      padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
                    }}>Dismiss</button>

                    {r.listing && (
                      <button onClick={function() { deleteListingAndReport(r._id, r.listing._id) }} style={{
                        background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                        padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
                      }}>Delete Listing</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}