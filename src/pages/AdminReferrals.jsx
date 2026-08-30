import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { Search, Download, Gift } from 'lucide-react'

const PAGE_SIZE = 20

function exportCSV(rows) {
  const headers = ['Name', 'Email', 'Referral Code', 'Points', 'Referrals Made', 'Referred By', 'Joined']
  const csvRows = [headers.join(',')]
  rows.forEach(u => {
    csvRows.push([
      '"' + (u.name || '') + '"',
      '"' + (u.email || '') + '"',
      '"' + (u.referralCode || '') + '"',
      u.points || 0,
      u.referralCount || 0,
      '"' + (u.referredBy?.name || 'Direct') + '"',
      '"' + new Date(u.joinedAt).toLocaleDateString() + '"',
    ].join(','))
  })
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = 'referrals.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminReferrals() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    api.get('/admin/referrals')
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return users.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.referralCode?.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  useEffect(() => { setPage(1) }, [search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalPoints    = users.reduce((sum, u) => sum + (u.points || 0), 0)
  const totalReferrals = users.reduce((sum, u) => sum + (u.referralCount || 0), 0)
  const topUser        = users[0]

  return (
    <AdminLayout>
      <style>{`
        .ar-page { padding: 0; }
        .ar-toolbar { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-bottom: 20px; }
        .ar-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
        .ar-stat { background: white; border-radius: 12px; padding: 14px 16px; border: 1px solid #f1f5f9; }
        .ar-stat-num { font-size: 22px; font-weight: 800; color: #08162F; }
        .ar-stat-label { font-size: 11px; color: #9ca3af; font-weight: 600; margin-top: 2px; }
        .ar-filters { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
        .ar-search { display: flex; align-items: center; gap: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 12px; flex: 1; min-width: 200px; }
        .ar-search input { border: none; outline: none; font-size: 13px; width: 100%; font-family: inherit; }
        .ar-export { display: flex; align-items: center; gap: 6px; background: #08162F; color: white; border: none; padding: 9px 16px; border-radius: 10px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; }
        .ar-table-wrap { background: white; border-radius: 14px; border: 1px solid #f1f5f9; overflow: hidden; }
        .ar-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .ar-table th { background: #f8fafc; padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9; }
        .ar-table td { padding: 12px 14px; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
        .ar-table tr:last-child td { border-bottom: none; }
        .ar-name { font-weight: 700; color: #111827; }
        .ar-email { font-size: 11px; color: #9ca3af; }
        .ar-code { font-family: monospace; font-size: 12px; background: #f3f4f6; padding: 2px 8px; border-radius: 6px; color: #374151; font-weight: 700; }
        .ar-points { font-size: 15px; font-weight: 800; color: #059669; }
        .ar-count { font-size: 13px; font-weight: 700; color: #2563eb; }
        .ar-empty { text-align: center; padding: 48px; color: #9ca3af; }
        .ar-pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f1f5f9; }
        .ar-page-btns { display: flex; gap: 4px; }
        .ar-page-btn { padding: 5px 10px; border-radius: 6px; border: 1px solid #e5e7eb; background: white; font-size: 12px; cursor: pointer; font-family: inherit; }
        .ar-page-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .ar-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ar-page-info { font-size: 12px; color: #9ca3af; }
        @media (max-width: 768px) { .ar-stats { grid-template-columns: 1fr 1fr; } .ar-table-wrap { overflow-x: auto; } }
      `}</style>

      <div className="ar-page">
        <div className="ar-toolbar">
          <div className="adm-page-header" style={{ marginBottom: 0 }}>
            <h1 className="adm-page-title">Referral Program</h1>
            <p className="adm-page-sub">{users.length} users — {totalReferrals} total referrals made</p>
          </div>
          <button className="ar-export" onClick={() => exportCSV(filtered)}>
            <Download size={13} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="ar-stats">
          <div className="ar-stat">
            <div className="ar-stat-num">{totalReferrals}</div>
            <div className="ar-stat-label">Total Referrals</div>
          </div>
          <div className="ar-stat">
            <div className="ar-stat-num">{totalPoints}</div>
            <div className="ar-stat-label">Total Points Awarded</div>
          </div>
          <div className="ar-stat">
            <div className="ar-stat-num">{topUser?.name?.split(' ')[0] || '—'}</div>
            <div className="ar-stat-label">Top Referrer</div>
          </div>
        </div>

        {/* Search */}
        <div className="ar-filters">
          <div className="ar-search">
            <Search size={14} color="#9ca3af" />
            <input
              placeholder="Search by name, email or referral code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="ar-table-wrap">
          {loading ? (
            <div className="ar-empty">Loading referrals...</div>
          ) : pageItems.length === 0 ? (
            <div className="ar-empty">No referrals found</div>
          ) : (
            <>
              <table className="ar-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Referral Code</th>
                    <th>Points</th>
                    <th>Referrals Made</th>
                    <th>Referred By</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="ar-name">{u.name}</div>
                        <div className="ar-email">{u.email}</div>
                      </td>
                      <td>
                        <span className="ar-code">{u.referralCode || '—'}</span>
                      </td>
                      <td>
                        <span className="ar-points">{u.points || 0} pts</span>
                      </td>
                      <td>
                        <span className="ar-count">{u.referralCount || 0}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, color: u.referredBy ? '#2563eb' : '#9ca3af', fontWeight: u.referredBy ? 600 : 400 }}>
                          {u.referredBy?.name || 'Direct signup'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: '#6b7280' }}>
                        {new Date(u.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ar-pagination">
                <span className="ar-page-info">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="ar-page-btns">
                  <button className="ar-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                    <button key={i} className={'ar-page-btn' + (page === i + 1 ? ' active' : '')} onClick={() => setPage(i + 1)}>{i + 1}</button>
                  ))}
                  <button className="ar-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}