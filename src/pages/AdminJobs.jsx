import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { Search, Trash2, Download, PlusCircle, Briefcase } from 'lucide-react'

const TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship']
const PAGE_SIZE = 20

function exportCSV(rows, headers, filename) {
  const csvRows = [headers.map(function(h) { return h.label }).join(',')]
  rows.forEach(function(row) {
    csvRows.push(headers.map(function(h) {
      const val = h.get(row)
      const escaped = ('' + (val ?? '')).replace(/"/g, '""')
      return '"' + escaped + '"'
    }).join(','))
  })
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminJobs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [page, setPage] = useState(1)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchData()
  }, [])

  function fetchData() {
    setLoading(true)
    Promise.all([api.get('/admin/jobs'), api.get('/admin/stats')])
      .then(function(res) { setJobs(res[0].data); setStats(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function deleteJob(id) {
    if (!window.confirm('Permanently delete this job posting?')) return
    api.delete('/admin/jobs/' + id).then(fetchData).catch(function() { alert('Failed') })
  }

  function deleteSelected() {
    if (selectedIds.size === 0) return
    if (!window.confirm('Permanently delete ' + selectedIds.size + ' job' + (selectedIds.size !== 1 ? 's' : '') + '?')) return
    Promise.all(Array.from(selectedIds).map(function(id) { return api.delete('/admin/jobs/' + id) }))
      .then(function() { setSelectedIds(new Set()); fetchData() })
      .catch(function() { alert('Some deletions failed.'); fetchData() })
  }

  const typeCounts = useMemo(function() {
    const counts = {}
    jobs.forEach(function(j) {
      const t = j.type || 'Other'
      counts[t] = (counts[t] || 0) + 1
    })
    return counts
  }, [jobs])

  const filtered = useMemo(function() {
    return jobs.filter(function(j) {
      const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
        (j.company && j.company.toLowerCase().includes(search.toLowerCase())) ||
        (j.user?.name && j.user.name.toLowerCase().includes(search.toLowerCase()))
      const matchType = type === 'All' || j.type === type
      return matchSearch && matchType
    }).sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
  }, [jobs, search, type])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(function() { setPage(1) }, [search, type])

  function toggleOne(id) {
    setSelectedIds(function(prev) {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllOnPage() {
    const pageIds = pageItems.map(function(j) { return j._id })
    const allSelected = pageIds.every(function(id) { return selectedIds.has(id) })
    setSelectedIds(function(prev) {
      const next = new Set(prev)
      if (allSelected) pageIds.forEach(function(id) { next.delete(id) })
      else pageIds.forEach(function(id) { next.add(id) })
      return next
    })
  }

  function handleExport() {
    exportCSV(filtered, [
      { label: 'Title', get: function(j) { return j.title } },
      { label: 'Company', get: function(j) { return j.company || '' } },
      { label: 'Type', get: function(j) { return j.type || '' } },
      
      { label: 'Location', get: function(j) {
         return j.location?.city
         ? j.location.city.trim() + (j.location.area ? ', ' + j.location.area.trim() : '')
         : 'Remote'
      }},
      { label: 'Posted By', get: function(j) { return j.user?.name || 'Unknown' } },
      { label: 'Posted At', get: function(j) { return new Date(j.createdAt).toLocaleDateString() } },
    ], 'jobs.csv')
  }

  const pageIds = pageItems.map(function(j) { return j._id })
  const allOnPageSelected = pageIds.length > 0 && pageIds.every(function(id) { return selectedIds.has(id) })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .aj-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        .aj-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .aj-add-btn {
          background: #00C896; color: white; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
        }
        .aj-add-btn:hover { background: #059669; }

        .aj-tabs { display: flex; gap: 4px; margin-bottom: 16px; overflow-x: auto; scrollbar-width: none; border-bottom: 1.5px solid #eef0f4; }
        .aj-tabs::-webkit-scrollbar { display: none; }
        .aj-tab {
          padding: 9px 14px; font-size: 12.5px; font-weight: 700; color: #6b7280;
          background: none; border: none; cursor: pointer; font-family: inherit;
          white-space: nowrap; border-bottom: 2.5px solid transparent; margin-bottom: -1.5px;
        }
        .aj-tab.active { color: #08162F; border-bottom-color: #d97706; }
        .aj-tab:hover:not(.active) { color: #374151; }

        .aj-filters-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .aj-search {
          display: flex; align-items: center; gap: 8px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 10px; padding: 0 14px; height: 40px; flex: 1; min-width: 200px;
        }
        .aj-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .aj-search input { border: none; outline: none; font-size: 13px; color: #374151; font-family: inherit; flex: 1; background: transparent; }
        .aj-export-btn {
          height: 40px; padding: 0 14px; border: 1.5px solid #e8ecf4; border-radius: 10px;
          background: white; font-size: 12.5px; font-weight: 700; color: #374151; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .aj-export-btn:hover { border-color: #00C896; color: #059669; }

        .aj-bulk-bar {
          display: flex; align-items: center; gap: 12px; background: #08162F; color: white;
          padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .aj-bulk-count { font-size: 12.5px; font-weight: 700; }
        .aj-bulk-btn {
          background: #ef4444; border: 1px solid #ef4444; color: white;
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 5px;
        }
        .aj-bulk-btn:hover { background: #dc2626; }
        .aj-bulk-clear { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; margin-left: auto; }
        .aj-bulk-clear:hover { color: white; }

        .aj-table-wrap { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow-x: auto; }
        .aj-table { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 680px; }
        .aj-table th {
          text-align: left; color: #9ca3af; font-weight: 700; font-size: 10.5px; text-transform: uppercase;
          letter-spacing: 0.04em; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background: #fafbfc; white-space: nowrap;
        }
        .aj-table td { padding: 10px 14px; border-bottom: 1px solid #f8fafc; vertical-align: middle; white-space: nowrap; }
        .aj-table tr:last-child td { border-bottom: none; }
        .aj-row-title { display: flex; align-items: center; gap: 10px; }
        .aj-row-icon { width: 34px; height: 34px; border-radius: 8px; background: #fffbeb; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .aj-row-name { font-weight: 700; color: #111827; white-space: normal; max-width: 220px; }
        .aj-type-pill { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; background: #fffbeb; color: #d97706; }
        .aj-del-btn {
          width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e8ecf4; background: white;
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280;
        }
        .aj-del-btn:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

        .aj-empty { text-align: center; padding: 60px 20px; color: #9ca3af; font-size: 13.5px; }

        .aj-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; flex-wrap: wrap; gap: 10px; }
        .aj-page-info { font-size: 12px; color: #9ca3af; font-weight: 600; }
        .aj-page-btns { display: flex; gap: 5px; }
        .aj-page-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid #e8ecf4; background: white;
          font-size: 12px; font-weight: 700; color: #374151; cursor: pointer; font-family: inherit;
        }
        .aj-page-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .aj-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 700px) {
          .aj-filters-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>

      <div className="aj-page">
        <div className="aj-toolbar">
          <div className="adm-page-header" style={{ marginBottom: 0 }}>
            <h1 className="adm-page-title">All Jobs</h1>
            <p className="adm-page-sub">{jobs.length} total job postings on Scalablenexus</p>
          </div>
          <Link to="/create" className="aj-add-btn"><PlusCircle size={14} /> Add Job</Link>
        </div>

        <div className="aj-tabs">
          <button className={'aj-tab' + (type === 'All' ? ' active' : '')} onClick={function() { setType('All') }}>
            All ({jobs.length})
          </button>
          {TYPES.filter(function(t) { return t !== 'All' }).map(function(t) {
            return (
              <button key={t} className={'aj-tab' + (type === t ? ' active' : '')} onClick={function() { setType(t) }}>
                {t} ({typeCounts[t] || 0})
              </button>
            )
          })}
        </div>

        <div className="aj-filters-row">
          <div className="aj-search">
            <Search size={14} color="#9ca3af" />
            <input placeholder="Search by title, company or poster..." value={search}
              onChange={function(e) { setSearch(e.target.value) }} />
          </div>
          <button className="aj-export-btn" onClick={handleExport}><Download size={14} /> Export CSV</button>
        </div>

        {selectedIds.size > 0 && (
          <div className="aj-bulk-bar">
            <span className="aj-bulk-count">{selectedIds.size} selected</span>
            <button className="aj-bulk-btn" onClick={deleteSelected}><Trash2 size={13} /> Delete</button>
            <button className="aj-bulk-clear" onClick={function() { setSelectedIds(new Set()) }}>Clear</button>
          </div>
        )}

        {loading ? (
          <div className="aj-empty">Loading jobs...</div>
        ) : filtered.length === 0 ? (
          <div className="aj-empty">No jobs found</div>
        ) : (
          <>
            <div className="aj-table-wrap">
              <table className="aj-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={allOnPageSelected} onChange={toggleAllOnPage} /></th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Posted By</th>
                    <th>Posted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(function(j) {
                    return (
                      <tr key={j._id}>
                        <td><input type="checkbox" checked={selectedIds.has(j._id)} onChange={function() { toggleOne(j._id) }} /></td>
                        <td>
                          <div className="aj-row-title">
                            <div className="aj-row-icon"><Briefcase size={15} color="#d97706" /></div>
                            <span className="aj-row-name">{j.title}</span>
                          </div>
                        </td>
                        <td>{j.company || '—'}</td>
                        <td>{j.type ? <span className="aj-type-pill">{j.type}</span> : '—'}</td>
                      
                        <td>
                           {j.location?.city
                           ? j.location.city.trim() + (j.location.area ? ', ' + j.location.area.trim() : '')
                           : 'Remote'}
                        </td>
                        <td>{j.user?.name || 'Unknown'}</td>
                        <td>{new Date(j.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <button className="aj-del-btn" title="Delete" onClick={function() { deleteJob(j._id) }}><Trash2 size={13} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="aj-pagination">
              <span className="aj-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="aj-page-btns">
                <button className="aj-page-btn" disabled={page === 1} onClick={function() { setPage(page - 1) }}>‹</button>
                {Array.from({ length: totalPages }).slice(0, 5).map(function(_, i) {
                  const p = i + 1
                  return <button key={p} className={'aj-page-btn' + (page === p ? ' active' : '')} onClick={function() { setPage(p) }}>{p}</button>
                })}
                <button className="aj-page-btn" disabled={page === totalPages} onClick={function() { setPage(page + 1) }}>›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}