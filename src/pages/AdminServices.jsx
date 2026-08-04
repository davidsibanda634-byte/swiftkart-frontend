import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'
import { Search, Trash2, Download, PlusCircle } from 'lucide-react'

const CATS = ['All', 'Tutoring', 'Design', 'Photography', 'Writing', 'Tech Help', 'Other']
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

export default function AdminServices() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
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
    Promise.all([api.get('/admin/services'), api.get('/admin/stats')])
      .then(function(res) { setServices(res[0].data); setStats(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function getImg(img) {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  function deleteService(id) {
    if (!window.confirm('Permanently delete this service?')) return
    api.delete('/admin/services/' + id).then(fetchData).catch(function() { alert('Failed') })
  }

  function deleteSelected() {
    if (selectedIds.size === 0) return
    if (!window.confirm('Permanently delete ' + selectedIds.size + ' service' + (selectedIds.size !== 1 ? 's' : '') + '?')) return
    Promise.all(Array.from(selectedIds).map(function(id) { return api.delete('/admin/services/' + id) }))
      .then(function() { setSelectedIds(new Set()); fetchData() })
      .catch(function() { alert('Some deletions failed.'); fetchData() })
  }

  const catCounts = useMemo(function() {
    const counts = {}
    services.forEach(function(s) {
      const c = s.category || 'Other'
      counts[c] = (counts[c] || 0) + 1
    })
    return counts
  }, [services])

  const filtered = useMemo(function() {
    let result = services.filter(function(s) {
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
        (s.user?.name && s.user.name.toLowerCase().includes(search.toLowerCase()))
      const matchCat = category === 'All' || s.category === category
      return matchSearch && matchCat
    })
    if (sort === 'price_low') result.sort(function(a, b) { return (a.pricePerHour || 0) - (b.pricePerHour || 0) })
    else if (sort === 'price_high') result.sort(function(a, b) { return (b.pricePerHour || 0) - (a.pricePerHour || 0) })
    else result.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
    return result
  }, [services, search, category, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(function() { setPage(1) }, [search, category, sort])

  function toggleOne(id) {
    setSelectedIds(function(prev) {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllOnPage() {
    const pageIds = pageItems.map(function(s) { return s._id })
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
      { label: 'Title', get: function(s) { return s.title } },
      { label: 'Category', get: function(s) { return s.category || 'Other' } },
      { label: 'Provider', get: function(s) { return s.user?.name || 'Unknown' } },
      { label: 'Price/hr', get: function(s) { return s.pricePerHour } },
      { label: 'Posted At', get: function(s) { return new Date(s.createdAt).toLocaleDateString() } },
    ], 'services.csv')
  }

  const pageIds = pageItems.map(function(s) { return s._id })
  const allOnPageSelected = pageIds.length > 0 && pageIds.every(function(id) { return selectedIds.has(id) })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .as-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        .as-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .as-add-btn {
          background: #00C896; color: white; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
        }
        .as-add-btn:hover { background: #059669; }

        .as-tabs { display: flex; gap: 4px; margin-bottom: 16px; overflow-x: auto; scrollbar-width: none; border-bottom: 1.5px solid #eef0f4; }
        .as-tabs::-webkit-scrollbar { display: none; }
        .as-tab {
          padding: 9px 14px; font-size: 12.5px; font-weight: 700; color: #6b7280;
          background: none; border: none; cursor: pointer; font-family: inherit;
          white-space: nowrap; border-bottom: 2.5px solid transparent; margin-bottom: -1.5px;
        }
        .as-tab.active { color: #08162F; border-bottom-color: #7C3AED; }
        .as-tab:hover:not(.active) { color: #374151; }

        .as-filters-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .as-search {
          display: flex; align-items: center; gap: 8px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 10px; padding: 0 14px; height: 40px; flex: 1; min-width: 200px;
        }
        .as-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .as-search input { border: none; outline: none; font-size: 13px; color: #374151; font-family: inherit; flex: 1; background: transparent; }
        .as-select {
          height: 40px; border: 1.5px solid #e8ecf4; border-radius: 10px; padding: 0 12px;
          font-size: 12.5px; font-weight: 600; color: #374151; background: white; font-family: inherit; cursor: pointer;
        }
        .as-export-btn {
          height: 40px; padding: 0 14px; border: 1.5px solid #e8ecf4; border-radius: 10px;
          background: white; font-size: 12.5px; font-weight: 700; color: #374151; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .as-export-btn:hover { border-color: #00C896; color: #059669; }

        .as-bulk-bar {
          display: flex; align-items: center; gap: 12px; background: #08162F; color: white;
          padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .as-bulk-count { font-size: 12.5px; font-weight: 700; }
        .as-bulk-btn {
          background: #ef4444; border: 1px solid #ef4444; color: white;
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 5px;
        }
        .as-bulk-btn:hover { background: #dc2626; }
        .as-bulk-clear { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; margin-left: auto; }
        .as-bulk-clear:hover { color: white; }

        .as-table-wrap { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow-x: auto; }
        .as-table { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 680px; }
        .as-table th {
          text-align: left; color: #9ca3af; font-weight: 700; font-size: 10.5px; text-transform: uppercase;
          letter-spacing: 0.04em; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background: #fafbfc; white-space: nowrap;
        }
        .as-table td { padding: 10px 14px; border-bottom: 1px solid #f8fafc; vertical-align: middle; white-space: nowrap; }
        .as-table tr:last-child td { border-bottom: none; }
        .as-row-title { display: flex; align-items: center; gap: 10px; }
        .as-row-thumb { width: 38px; height: 38px; border-radius: 8px; object-fit: cover; background: #f5f3ff; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .as-row-name { font-weight: 700; color: #111827; white-space: normal; max-width: 220px; }
        .as-price { font-weight: 800; color: #7C3AED; }
        .as-cat-pill { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; background: #f5f3ff; color: #7C3AED; }
        .as-del-btn {
          width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e8ecf4; background: white;
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280;
        }
        .as-del-btn:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

        .as-empty { text-align: center; padding: 60px 20px; color: #9ca3af; font-size: 13.5px; }

        .as-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; flex-wrap: wrap; gap: 10px; }
        .as-page-info { font-size: 12px; color: #9ca3af; font-weight: 600; }
        .as-page-btns { display: flex; gap: 5px; }
        .as-page-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid #e8ecf4; background: white;
          font-size: 12px; font-weight: 700; color: #374151; cursor: pointer; font-family: inherit;
        }
        .as-page-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .as-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 700px) {
          .as-filters-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>

      <div className="as-page">
        <div className="as-toolbar">
          <div className="adm-page-header" style={{ marginBottom: 0 }}>
            <h1 className="adm-page-title">All Services</h1>
            <p className="adm-page-sub">{services.length} total services on Scalablenexus</p>
          </div>
          <Link to="/create" className="as-add-btn"><PlusCircle size={14} /> Add Service</Link>
        </div>

        <div className="as-tabs">
          <button className={'as-tab' + (category === 'All' ? ' active' : '')} onClick={function() { setCategory('All') }}>
            All ({services.length})
          </button>
          {CATS.filter(function(c) { return c !== 'All' }).map(function(cat) {
            return (
              <button key={cat} className={'as-tab' + (category === cat ? ' active' : '')} onClick={function() { setCategory(cat) }}>
                {cat} ({catCounts[cat] || 0})
              </button>
            )
          })}
        </div>

        <div className="as-filters-row">
          <div className="as-search">
            <Search size={14} color="#9ca3af" />
            <input placeholder="Search by title or provider..." value={search}
              onChange={function(e) { setSearch(e.target.value) }} />
          </div>
          <select className="as-select" value={sort} onChange={function(e) { setSort(e.target.value) }}>
            <option value="newest">Sort: Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
          <button className="as-export-btn" onClick={handleExport}><Download size={14} /> Export CSV</button>
        </div>

        {selectedIds.size > 0 && (
          <div className="as-bulk-bar">
            <span className="as-bulk-count">{selectedIds.size} selected</span>
            <button className="as-bulk-btn" onClick={deleteSelected}><Trash2 size={13} /> Delete</button>
            <button className="as-bulk-clear" onClick={function() { setSelectedIds(new Set()) }}>Clear</button>
          </div>
        )}

        {loading ? (
          <div className="as-empty">Loading services...</div>
        ) : filtered.length === 0 ? (
          <div className="as-empty">No services found</div>
        ) : (
          <>
            <div className="as-table-wrap">
              <table className="as-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={allOnPageSelected} onChange={toggleAllOnPage} /></th>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Provider</th>
                    <th>Price/hr</th>
                    <th>Posted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(function(s) {
                    const imgUrl = getImg(s.images && s.images[0])
                    return (
                      <tr key={s._id}>
                        <td><input type="checkbox" checked={selectedIds.has(s._id)} onChange={function() { toggleOne(s._id) }} /></td>
                        <td>
                          <div className="as-row-title">
                            <div className="as-row-thumb">
                              {imgUrl ? <img src={imgUrl} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : '🧑‍💼'}
                            </div>
                            <span className="as-row-name">{s.title}</span>
                          </div>
                        </td>
                        <td>{s.category ? <span className="as-cat-pill">{s.category}</span> : '—'}</td>
                        <td>{s.user?.name || 'Unknown'}</td>
                        <td className="as-price">{formatPrice(s.pricePerHour)}/hr</td>
                        <td>{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <button className="as-del-btn" title="Delete" onClick={function() { deleteService(s._id) }}><Trash2 size={13} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="as-pagination">
              <span className="as-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="as-page-btns">
                <button className="as-page-btn" disabled={page === 1} onClick={function() { setPage(page - 1) }}>‹</button>
                {Array.from({ length: totalPages }).slice(0, 5).map(function(_, i) {
                  const p = i + 1
                  return <button key={p} className={'as-page-btn' + (page === p ? ' active' : '')} onClick={function() { setPage(p) }}>{p}</button>
                })}
                <button className="as-page-btn" disabled={page === totalPages} onClick={function() { setPage(page + 1) }}>›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}