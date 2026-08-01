import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'
import { Search, Trash2, Download, PlusCircle } from 'lucide-react'

const CATS = ['All', 'Fashion', 'Cosmetics & Hair', 'Mobile & Accessories', 'Vehicles', 'Furniture', 'Electronics', 'Food', 'Other']
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

export default function AdminListings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [seller, setSeller] = useState('All')
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
    Promise.all([api.get('/admin/listings'), api.get('/admin/stats')])
      .then(function(res) { setListings(res[0].data); setStats(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function getImg(img) {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  function deleteListing(id) {
    if (!window.confirm('Permanently delete this listing?')) return
    api.delete('/admin/listings/' + id).then(fetchData).catch(function() { alert('Failed') })
  }

  function deleteSelected() {
    if (selectedIds.size === 0) return
    if (!window.confirm('Permanently delete ' + selectedIds.size + ' listing' + (selectedIds.size !== 1 ? 's' : '') + '?')) return
    Promise.all(Array.from(selectedIds).map(function(id) { return api.delete('/admin/listings/' + id) }))
      .then(function() { setSelectedIds(new Set()); fetchData() })
      .catch(function() { alert('Some deletions failed.'); fetchData() })
  }

  const sellers = useMemo(function() {
    const names = listings.map(function(l) { return l.user?.name }).filter(Boolean)
    return ['All', ...new Set(names)].sort()
  }, [listings])

  const catCounts = useMemo(function() {
    const counts = {}
    listings.forEach(function(l) {
      const c = l.category || 'Other'
      counts[c] = (counts[c] || 0) + 1
    })
    return counts
  }, [listings])

  const filtered = useMemo(function() {
    let result = listings.filter(function(l) {
      const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
        (l.user?.name && l.user.name.toLowerCase().includes(search.toLowerCase()))
      const matchCat = category === 'All' || l.category === category
      const matchSeller = seller === 'All' || l.user?.name === seller
      return matchSearch && matchCat && matchSeller
    })
    if (sort === 'price_low') result.sort(function(a, b) { return (a.price || 0) - (b.price || 0) })
    else if (sort === 'price_high') result.sort(function(a, b) { return (b.price || 0) - (a.price || 0) })
    else if (sort === 'oldest') result.sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt) })
    else result.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
    return result
  }, [listings, search, category, seller, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(function() { setPage(1) }, [search, category, seller, sort])

  function toggleOne(id) {
    setSelectedIds(function(prev) {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllOnPage() {
    const pageIds = pageItems.map(function(l) { return l._id })
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
      { label: 'Title', get: function(l) { return l.title } },
      { label: 'Category', get: function(l) { return l.category || 'Other' } },
      { label: 'Seller', get: function(l) { return l.user?.name || 'Unknown' } },
      { label: 'Price', get: function(l) { return l.price } },
      { label: 'Status', get: function(l) { return l.status || 'Active' } },
      { label: 'Listed At', get: function(l) { return new Date(l.createdAt).toLocaleDateString() } },
    ], 'listings.csv')
  }

  const pageIds = pageItems.map(function(l) { return l._id })
  const allOnPageSelected = pageIds.length > 0 && pageIds.every(function(id) { return selectedIds.has(id) })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .al-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        .al-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .al-add-btn {
          background: #00C896; color: white; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
        }
        .al-add-btn:hover { background: #059669; }

        .al-tabs { display: flex; gap: 4px; margin-bottom: 16px; overflow-x: auto; scrollbar-width: none; border-bottom: 1.5px solid #eef0f4; }
        .al-tabs::-webkit-scrollbar { display: none; }
        .al-tab {
          padding: 9px 14px; font-size: 12.5px; font-weight: 700; color: #6b7280;
          background: none; border: none; cursor: pointer; font-family: inherit;
          white-space: nowrap; border-bottom: 2.5px solid transparent; margin-bottom: -1.5px;
        }
        .al-tab.active { color: #08162F; border-bottom-color: #00C896; }
        .al-tab:hover:not(.active) { color: #374151; }

        .al-filters-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .al-search {
          display: flex; align-items: center; gap: 8px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 10px; padding: 0 14px; height: 40px; flex: 1; min-width: 200px;
        }
        .al-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .al-search input { border: none; outline: none; font-size: 13px; color: #374151; font-family: inherit; flex: 1; background: transparent; }
        .al-select {
          height: 40px; border: 1.5px solid #e8ecf4; border-radius: 10px; padding: 0 12px;
          font-size: 12.5px; font-weight: 600; color: #374151; background: white; font-family: inherit; cursor: pointer;
        }
        .al-export-btn {
          height: 40px; padding: 0 14px; border: 1.5px solid #e8ecf4; border-radius: 10px;
          background: white; font-size: 12.5px; font-weight: 700; color: #374151; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .al-export-btn:hover { border-color: #00C896; color: #059669; }

        .al-bulk-bar {
          display: flex; align-items: center; gap: 12px; background: #08162F; color: white;
          padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .al-bulk-count { font-size: 12.5px; font-weight: 700; }
        .al-bulk-btn {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 5px;
        }
        .al-bulk-btn.danger { background: #ef4444; border-color: #ef4444; }
        .al-bulk-btn.danger:hover { background: #dc2626; }
        .al-bulk-clear { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; margin-left: auto; }
        .al-bulk-clear:hover { color: white; }

        .al-table-wrap { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow-x: auto; }
        .al-table { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 720px; }
        .al-table th {
          text-align: left; color: #9ca3af; font-weight: 700; font-size: 10.5px; text-transform: uppercase;
          letter-spacing: 0.04em; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background: #fafbfc; white-space: nowrap;
        }
        .al-table td { padding: 10px 14px; border-bottom: 1px solid #f8fafc; vertical-align: middle; white-space: nowrap; }
        .al-table tr:last-child td { border-bottom: none; }
        .al-row-title { display: flex; align-items: center; gap: 10px; }
        .al-row-thumb { width: 38px; height: 38px; border-radius: 8px; object-fit: cover; background: #f8fafc; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .al-row-name { font-weight: 700; color: #111827; white-space: normal; max-width: 220px; }
        .al-price { font-weight: 800; color: #00C896; }
        .al-status-pill { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; background: #ecfdf5; color: #059669; }
        .al-del-btn {
          width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e8ecf4; background: white;
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280;
        }
        .al-del-btn:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

        .al-empty { text-align: center; padding: 60px 20px; color: #9ca3af; font-size: 13.5px; }

        .al-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; flex-wrap: wrap; gap: 10px; }
        .al-page-info { font-size: 12px; color: #9ca3af; font-weight: 600; }
        .al-page-btns { display: flex; gap: 5px; }
        .al-page-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid #e8ecf4; background: white;
          font-size: 12px; font-weight: 700; color: #374151; cursor: pointer; font-family: inherit;
        }
        .al-page-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .al-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 700px) {
          .al-filters-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>

      <div className="al-page">
        <div className="al-toolbar">
          <div className="adm-page-header" style={{ marginBottom: 0 }}>
            <h1 className="adm-page-title">All Listings</h1>
            <p className="adm-page-sub">{listings.length} total listings on Scalablenexus</p>
          </div>
          <Link to="/create" className="al-add-btn"><PlusCircle size={14} /> Add Listing</Link>
        </div>

        <div className="al-tabs">
          <button className={'al-tab' + (category === 'All' ? ' active' : '')} onClick={function() { setCategory('All') }}>
            All ({listings.length})
          </button>
          {CATS.filter(function(c) { return c !== 'All' }).map(function(cat) {
            return (
              <button key={cat} className={'al-tab' + (category === cat ? ' active' : '')} onClick={function() { setCategory(cat) }}>
                {cat} ({catCounts[cat] || 0})
              </button>
            )
          })}
        </div>

        <div className="al-filters-row">
          <div className="al-search">
            <Search size={14} color="#9ca3af" />
            <input placeholder="Search listings..." value={search}
              onChange={function(e) { setSearch(e.target.value) }} />
          </div>
          <select className="al-select" value={seller} onChange={function(e) { setSeller(e.target.value) }}>
            {sellers.map(function(s) { return <option key={s} value={s}>{s === 'All' ? 'All Sellers' : s}</option> })}
          </select>
          <select className="al-select" value={sort} onChange={function(e) { setSort(e.target.value) }}>
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
          <button className="al-export-btn" onClick={handleExport}><Download size={14} /> Export CSV</button>
        </div>

        {selectedIds.size > 0 && (
          <div className="al-bulk-bar">
            <span className="al-bulk-count">{selectedIds.size} selected</span>
            <button className="al-bulk-btn danger" onClick={deleteSelected}><Trash2 size={13} /> Delete</button>
            <button className="al-bulk-clear" onClick={function() { setSelectedIds(new Set()) }}>Clear</button>
          </div>
        )}

        {loading ? (
          <div className="al-empty">Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div className="al-empty">No listings found</div>
        ) : (
          <>
            <div className="al-table-wrap">
              <table className="al-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={allOnPageSelected} onChange={toggleAllOnPage} /></th>
                    <th>Listing</th>
                    <th>Category</th>
                    <th>Seller</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Listed At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(function(l) {
                    const imgUrl = getImg(l.images && l.images[0])
                    return (
                      <tr key={l._id}>
                        <td><input type="checkbox" checked={selectedIds.has(l._id)} onChange={function() { toggleOne(l._id) }} /></td>
                        <td>
                          <div className="al-row-title">
                            <div className="al-row-thumb">
                              {imgUrl ? <img src={imgUrl} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : '🛍️'}
                            </div>
                            <span className="al-row-name">{l.title}</span>
                          </div>
                        </td>
                        <td>{l.category || 'Other'}</td>
                        <td>{l.user?.name || 'Unknown'}</td>
                        <td className="al-price">{formatPrice(l.price)}</td>
                        <td><span className="al-status-pill">{l.status || 'Active'}</span></td>
                        <td>{new Date(l.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <button className="al-del-btn" title="Delete" onClick={function() { deleteListing(l._id) }}><Trash2 size={13} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="al-pagination">
              <span className="al-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="al-page-btns">
                <button className="al-page-btn" disabled={page === 1} onClick={function() { setPage(page - 1) }}>‹</button>
                {Array.from({ length: totalPages }).slice(0, 5).map(function(_, i) {
                  const p = i + 1
                  return <button key={p} className={'al-page-btn' + (page === p ? ' active' : '')} onClick={function() { setPage(p) }}>{p}</button>
                })}
                <button className="al-page-btn" disabled={page === totalPages} onClick={function() { setPage(page + 1) }}>›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}