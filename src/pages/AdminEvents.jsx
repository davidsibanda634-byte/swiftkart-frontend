import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'
import { Search, Trash2, Download, PlusCircle } from 'lucide-react'

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

export default function AdminEvents() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [page, setPage] = useState(1)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    if (!user.isAdmin) { navigate('/'); return }
    fetchData()
  }, [])

  function fetchData() {
    setLoading(true)
    Promise.all([api.get('/admin/events'), api.get('/admin/stats')])
      .then(function(res) { setEvents(res[0].data); setStats(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function getImg(img) {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  function deleteEvent(id) {
    if (!window.confirm('Permanently delete this event?')) return
    api.delete('/admin/events/' + id).then(fetchData).catch(function() { alert('Failed') })
  }

  function deleteSelected() {
    if (selectedIds.size === 0) return
    if (!window.confirm('Permanently delete ' + selectedIds.size + ' event' + (selectedIds.size !== 1 ? 's' : '') + '?')) return
    Promise.all(Array.from(selectedIds).map(function(id) { return api.delete('/admin/events/' + id) }))
      .then(function() { setSelectedIds(new Set()); fetchData() })
      .catch(function() { alert('Some deletions failed.'); fetchData() })
  }

  const filtered = useMemo(function() {
    let result = events.filter(function(e) {
      return e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.location && e.location.toLowerCase().includes(search.toLowerCase())) ||
        (e.user?.name && e.user.name.toLowerCase().includes(search.toLowerCase()))
    })
    if (sort === 'date') result.sort(function(a, b) { return new Date(a.date || 0) - new Date(b.date || 0) })
    else if (sort === 'oldest') result.sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt) })
    else result.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
    return result
  }, [events, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(function() { setPage(1) }, [search, sort])

  function toggleOne(id) {
    setSelectedIds(function(prev) {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllOnPage() {
    const pageIds = pageItems.map(function(e) { return e._id })
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
      { label: 'Title', get: function(e) { return e.title } },
      { label: 'Date', get: function(e) { return e.date ? new Date(e.date).toLocaleDateString() : 'TBA' } },
      { label: 'Location', get: function(e) { return e.location || '' } },
      { label: 'Price', get: function(e) { return e.price || 'Free' } },
      { label: 'Organizer', get: function(e) { return e.user?.name || 'Unknown' } },
      { label: 'Posted At', get: function(e) { return new Date(e.createdAt).toLocaleDateString() } },
    ], 'events.csv')
  }

  const pageIds = pageItems.map(function(e) { return e._id })
  const allOnPageSelected = pageIds.length > 0 && pageIds.every(function(id) { return selectedIds.has(id) })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .ae-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        .ae-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .ae-add-btn {
          background: #00C896; color: white; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
        }
        .ae-add-btn:hover { background: #059669; }

        .ae-filters-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .ae-search {
          display: flex; align-items: center; gap: 8px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 10px; padding: 0 14px; height: 40px; flex: 1; min-width: 200px;
        }
        .ae-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .ae-search input { border: none; outline: none; font-size: 13px; color: #374151; font-family: inherit; flex: 1; background: transparent; }
        .ae-select {
          height: 40px; border: 1.5px solid #e8ecf4; border-radius: 10px; padding: 0 12px;
          font-size: 12.5px; font-weight: 600; color: #374151; background: white; font-family: inherit; cursor: pointer;
        }
        .ae-export-btn {
          height: 40px; padding: 0 14px; border: 1.5px solid #e8ecf4; border-radius: 10px;
          background: white; font-size: 12.5px; font-weight: 700; color: #374151; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .ae-export-btn:hover { border-color: #00C896; color: #059669; }

        .ae-bulk-bar {
          display: flex; align-items: center; gap: 12px; background: #08162F; color: white;
          padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .ae-bulk-count { font-size: 12.5px; font-weight: 700; }
        .ae-bulk-btn {
          background: #ef4444; border: 1px solid #ef4444; color: white;
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 5px;
        }
        .ae-bulk-btn:hover { background: #dc2626; }
        .ae-bulk-clear { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; margin-left: auto; }
        .ae-bulk-clear:hover { color: white; }

        .ae-table-wrap { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow-x: auto; }
        .ae-table { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 680px; }
        .ae-table th {
          text-align: left; color: #9ca3af; font-weight: 700; font-size: 10.5px; text-transform: uppercase;
          letter-spacing: 0.04em; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background: #fafbfc; white-space: nowrap;
        }
        .ae-table td { padding: 10px 14px; border-bottom: 1px solid #f8fafc; vertical-align: middle; white-space: nowrap; }
        .ae-table tr:last-child td { border-bottom: none; }
        .ae-row-title { display: flex; align-items: center; gap: 10px; }
        .ae-row-thumb { width: 38px; height: 38px; border-radius: 8px; object-fit: cover; background: #fdf2f8; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .ae-row-name { font-weight: 700; color: #111827; white-space: normal; max-width: 220px; }
        .ae-price { font-weight: 800; color: #EC4899; }
        .ae-date-pill { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; background: #fdf2f8; color: #EC4899; }
        .ae-del-btn {
          width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e8ecf4; background: white;
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280;
        }
        .ae-del-btn:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

        .ae-empty { text-align: center; padding: 60px 20px; color: #9ca3af; font-size: 13.5px; }

        .ae-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; flex-wrap: wrap; gap: 10px; }
        .ae-page-info { font-size: 12px; color: #9ca3af; font-weight: 600; }
        .ae-page-btns { display: flex; gap: 5px; }
        .ae-page-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid #e8ecf4; background: white;
          font-size: 12px; font-weight: 700; color: #374151; cursor: pointer; font-family: inherit;
        }
        .ae-page-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .ae-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 700px) {
          .ae-filters-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>

      <div className="ae-page">
        <div className="ae-toolbar">
          <div className="adm-page-header" style={{ marginBottom: 0 }}>
            <h1 className="adm-page-title">All Events</h1>
            <p className="adm-page-sub">{events.length} total events on Scalablenexus</p>
          </div>
          <Link to="/create" className="ae-add-btn"><PlusCircle size={14} /> Add Event</Link>
        </div>

        <div className="ae-filters-row">
          <div className="ae-search">
            <Search size={14} color="#9ca3af" />
            <input placeholder="Search by title, location or organizer..." value={search}
              onChange={function(e) { setSearch(e.target.value) }} />
          </div>
          <select className="ae-select" value={sort} onChange={function(e) { setSort(e.target.value) }}>
            <option value="newest">Sort: Newest Posted</option>
            <option value="oldest">Sort: Oldest Posted</option>
            <option value="date">Sort: Event Date</option>
          </select>
          <button className="ae-export-btn" onClick={handleExport}><Download size={14} /> Export CSV</button>
        </div>

        {selectedIds.size > 0 && (
          <div className="ae-bulk-bar">
            <span className="ae-bulk-count">{selectedIds.size} selected</span>
            <button className="ae-bulk-btn" onClick={deleteSelected}><Trash2 size={13} /> Delete</button>
            <button className="ae-bulk-clear" onClick={function() { setSelectedIds(new Set()) }}>Clear</button>
          </div>
        )}

        {loading ? (
          <div className="ae-empty">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="ae-empty">No events found</div>
        ) : (
          <>
            <div className="ae-table-wrap">
              <table className="ae-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={allOnPageSelected} onChange={toggleAllOnPage} /></th>
                    <th>Event</th>
                    <th>Event Date</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Organizer</th>
                    <th>Posted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(function(e) {
                    const imgUrl = getImg(e.images && e.images[0])
                    const dateLabel = e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'
                    return (
                      <tr key={e._id}>
                        <td><input type="checkbox" checked={selectedIds.has(e._id)} onChange={function() { toggleOne(e._id) }} /></td>
                        <td>
                          <div className="ae-row-title">
                            <div className="ae-row-thumb">
                              {imgUrl ? <img src={imgUrl} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : '🎉'}
                            </div>
                            <span className="ae-row-name">{e.title}</span>
                          </div>
                        </td>
                        <td><span className="ae-date-pill">{dateLabel}</span></td>
                        <td>{e.location || 'TBA'}</td>
                        <td className="ae-price">{e.price ? formatPrice(e.price) : 'Free'}</td>
                        <td>{e.user?.name || 'Unknown'}</td>
                        <td>{new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <button className="ae-del-btn" title="Delete" onClick={function() { deleteEvent(e._id) }}><Trash2 size={13} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="ae-pagination">
              <span className="ae-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="ae-page-btns">
                <button className="ae-page-btn" disabled={page === 1} onClick={function() { setPage(page - 1) }}>‹</button>
                {Array.from({ length: totalPages }).slice(0, 5).map(function(_, i) {
                  const p = i + 1
                  return <button key={p} className={'ae-page-btn' + (page === p ? ' active' : '')} onClick={function() { setPage(p) }}>{p}</button>
                })}
                <button className="ae-page-btn" disabled={page === totalPages} onClick={function() { setPage(page + 1) }}>›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}