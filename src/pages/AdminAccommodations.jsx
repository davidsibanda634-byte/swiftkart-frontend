import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'
import { Search, Trash2, Download, PlusCircle } from 'lucide-react'

const TYPES = ['All', 'Room', 'Studio', 'Apartment', 'House', 'Cottage', 'Flat', 'Other']
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

export default function AdminAccommodations() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [accommodations, setAccommodations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [propertyType, setPropertyType] = useState('All')
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
    Promise.all([api.get('/admin/accommodations'), api.get('/admin/stats')])
      .then(function(res) { setAccommodations(res[0].data); setStats(res[1].data) })
      .catch(function() {})
      .finally(function() { setLoading(false) })
  }

  function getImg(img) {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  function deleteAccommodation(id) {
    if (!window.confirm('Permanently delete this property listing?')) return
    api.delete('/admin/accommodations/' + id).then(fetchData).catch(function() { alert('Failed') })
  }

  function deleteSelected() {
    if (selectedIds.size === 0) return
    if (!window.confirm('Permanently delete ' + selectedIds.size + ' propert' + (selectedIds.size !== 1 ? 'ies' : 'y') + '?')) return
    Promise.all(Array.from(selectedIds).map(function(id) { return api.delete('/admin/accommodations/' + id) }))
      .then(function() { setSelectedIds(new Set()); fetchData() })
      .catch(function() { alert('Some deletions failed.'); fetchData() })
  }

  const typeCounts = useMemo(function() {
    const counts = {}
    accommodations.forEach(function(a) {
      const t = a.propertyType || 'Other'
      counts[t] = (counts[t] || 0) + 1
    })
    return counts
  }, [accommodations])

  const filtered = useMemo(function() {
    let result = accommodations.filter(function(a) {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.user?.name && a.user.name.toLowerCase().includes(search.toLowerCase()))
      const matchType = propertyType === 'All' || a.propertyType === propertyType
      return matchSearch && matchType
    })
    if (sort === 'price_low') result.sort(function(a, b) { return (a.price || 0) - (b.price || 0) })
    else if (sort === 'price_high') result.sort(function(a, b) { return (b.price || 0) - (a.price || 0) })
    else result.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt) })
    return result
  }, [accommodations, search, propertyType, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(function() { setPage(1) }, [search, propertyType, sort])

  function toggleOne(id) {
    setSelectedIds(function(prev) {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAllOnPage() {
    const pageIds = pageItems.map(function(a) { return a._id })
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
      { label: 'Title', get: function(a) { return a.title } },
      { label: 'Property Type', get: function(a) { return a.propertyType || '' } },
      { label: 'Listing Type', get: function(a) { return a.listingType || '' } },
      { label: 'Price', get: function(a) { return a.price } },
      { label: 'Price Type', get: function(a) { return a.priceType || '' } },
      { label: 'Bedrooms', get: function(a) { return a.bedrooms || 0 } },
      { label: 'Bathrooms', get: function(a) { return a.bathrooms || 0 } },
      { label: 'Lister', get: function(a) { return a.user?.name || 'Unknown' } },
      { label: 'Posted At', get: function(a) { return new Date(a.createdAt).toLocaleDateString() } },
    ], 'accommodations.csv')
  }

  const pageIds = pageItems.map(function(a) { return a._id })
  const allOnPageSelected = pageIds.length > 0 && pageIds.every(function(id) { return selectedIds.has(id) })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .aa2-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        .aa2-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .aa2-add-btn {
          background: #00C896; color: white; border: none; padding: 9px 16px;
          border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
        }
        .aa2-add-btn:hover { background: #059669; }

        .aa2-tabs { display: flex; gap: 4px; margin-bottom: 16px; overflow-x: auto; scrollbar-width: none; border-bottom: 1.5px solid #eef0f4; }
        .aa2-tabs::-webkit-scrollbar { display: none; }
        .aa2-tab {
          padding: 9px 14px; font-size: 12.5px; font-weight: 700; color: #6b7280;
          background: none; border: none; cursor: pointer; font-family: inherit;
          white-space: nowrap; border-bottom: 2.5px solid transparent; margin-bottom: -1.5px;
        }
        .aa2-tab.active { color: #08162F; border-bottom-color: #2563EB; }
        .aa2-tab:hover:not(.active) { color: #374151; }

        .aa2-filters-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .aa2-search {
          display: flex; align-items: center; gap: 8px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 10px; padding: 0 14px; height: 40px; flex: 1; min-width: 200px;
        }
        .aa2-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .aa2-search input { border: none; outline: none; font-size: 13px; color: #374151; font-family: inherit; flex: 1; background: transparent; }
        .aa2-select {
          height: 40px; border: 1.5px solid #e8ecf4; border-radius: 10px; padding: 0 12px;
          font-size: 12.5px; font-weight: 600; color: #374151; background: white; font-family: inherit; cursor: pointer;
        }
        .aa2-export-btn {
          height: 40px; padding: 0 14px; border: 1.5px solid #e8ecf4; border-radius: 10px;
          background: white; font-size: 12.5px; font-weight: 700; color: #374151; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .aa2-export-btn:hover { border-color: #00C896; color: #059669; }

        .aa2-bulk-bar {
          display: flex; align-items: center; gap: 12px; background: #08162F; color: white;
          padding: 10px 16px; border-radius: 10px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .aa2-bulk-count { font-size: 12.5px; font-weight: 700; }
        .aa2-bulk-btn {
          background: #ef4444; border: 1px solid #ef4444; color: white;
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 5px;
        }
        .aa2-bulk-btn:hover { background: #dc2626; }
        .aa2-bulk-clear { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; margin-left: auto; }
        .aa2-bulk-clear:hover { color: white; }

        .aa2-table-wrap { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow-x: auto; }
        .aa2-table { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 760px; }
        .aa2-table th {
          text-align: left; color: #9ca3af; font-weight: 700; font-size: 10.5px; text-transform: uppercase;
          letter-spacing: 0.04em; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background: #fafbfc; white-space: nowrap;
        }
        .aa2-table td { padding: 10px 14px; border-bottom: 1px solid #f8fafc; vertical-align: middle; white-space: nowrap; }
        .aa2-table tr:last-child td { border-bottom: none; }
        .aa2-row-title { display: flex; align-items: center; gap: 10px; }
        .aa2-row-thumb { width: 38px; height: 38px; border-radius: 8px; object-fit: cover; background: #eff6ff; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .aa2-row-name { font-weight: 700; color: #111827; white-space: normal; max-width: 200px; }
        .aa2-price { font-weight: 800; color: #2563EB; }
        .aa2-price span { font-size: 10.5px; color: #9ca3af; font-weight: 500; }
        .aa2-type-pill { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; background: #eff6ff; color: #2563EB; }
        .aa2-listing-pill { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; color: white; }
        .aa2-del-btn {
          width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e8ecf4; background: white;
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280;
        }
        .aa2-del-btn:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

        .aa2-empty { text-align: center; padding: 60px 20px; color: #9ca3af; font-size: 13.5px; }

        .aa2-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; flex-wrap: wrap; gap: 10px; }
        .aa2-page-info { font-size: 12px; color: #9ca3af; font-weight: 600; }
        .aa2-page-btns { display: flex; gap: 5px; }
        .aa2-page-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid #e8ecf4; background: white;
          font-size: 12px; font-weight: 700; color: #374151; cursor: pointer; font-family: inherit;
        }
        .aa2-page-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .aa2-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 700px) {
          .aa2-filters-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>

      <div className="aa2-page">
        <div className="aa2-toolbar">
          <div className="adm-page-header" style={{ marginBottom: 0 }}>
            <h1 className="adm-page-title">All Properties</h1>
            <p className="adm-page-sub">{accommodations.length} total properties on Scalablenexus</p>
          </div>
          <Link to="/create" className="aa2-add-btn"><PlusCircle size={14} /> Add Property</Link>
        </div>

        <div className="aa2-tabs">
          <button className={'aa2-tab' + (propertyType === 'All' ? ' active' : '')} onClick={function() { setPropertyType('All') }}>
            All ({accommodations.length})
          </button>
          {TYPES.filter(function(t) { return t !== 'All' }).map(function(t) {
            return (
              <button key={t} className={'aa2-tab' + (propertyType === t ? ' active' : '')} onClick={function() { setPropertyType(t) }}>
                {t} ({typeCounts[t] || 0})
              </button>
            )
          })}
        </div>

        <div className="aa2-filters-row">
          <div className="aa2-search">
            <Search size={14} color="#9ca3af" />
            <input placeholder="Search by title or lister..." value={search}
              onChange={function(e) { setSearch(e.target.value) }} />
          </div>
          <select className="aa2-select" value={sort} onChange={function(e) { setSort(e.target.value) }}>
            <option value="newest">Sort: Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
          <button className="aa2-export-btn" onClick={handleExport}><Download size={14} /> Export CSV</button>
        </div>

        {selectedIds.size > 0 && (
          <div className="aa2-bulk-bar">
            <span className="aa2-bulk-count">{selectedIds.size} selected</span>
            <button className="aa2-bulk-btn" onClick={deleteSelected}><Trash2 size={13} /> Delete</button>
            <button className="aa2-bulk-clear" onClick={function() { setSelectedIds(new Set()) }}>Clear</button>
          </div>
        )}

        {loading ? (
          <div className="aa2-empty">Loading properties...</div>
        ) : filtered.length === 0 ? (
          <div className="aa2-empty">No properties found</div>
        ) : (
          <>
            <div className="aa2-table-wrap">
              <table className="aa2-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={allOnPageSelected} onChange={toggleAllOnPage} /></th>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Listing</th>
                    <th>Price</th>
                    <th>Beds/Baths</th>
                    <th>Lister</th>
                    <th>Posted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(function(a) {
                    const imgUrl = getImg(a.images && a.images[0])
                    const isForSale = a.listingType === 'For Sale'
                    return (
                      <tr key={a._id}>
                        <td><input type="checkbox" checked={selectedIds.has(a._id)} onChange={function() { toggleOne(a._id) }} /></td>
                        <td>
                          <div className="aa2-row-title">
                            <div className="aa2-row-thumb">
                              {imgUrl ? <img src={imgUrl} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : '🏠'}
                            </div>
                            <span className="aa2-row-name">{a.title}</span>
                          </div>
                        </td>
                        <td>{a.propertyType ? <span className="aa2-type-pill">{a.propertyType}</span> : '—'}</td>
                        <td>
                          <span className="aa2-listing-pill" style={{ background: isForSale ? '#d97706' : '#00C896' }}>
                            {a.listingType || 'For Rent'}
                          </span>
                        </td>
                        <td className="aa2-price">{formatPrice(a.price)} <span>{a.priceType || ''}</span></td>
                        <td>{a.bedrooms || 0} bed · {a.bathrooms || 0} bath</td>
                        <td>{a.user?.name || 'Unknown'}</td>
                        <td>{new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <button className="aa2-del-btn" title="Delete" onClick={function() { deleteAccommodation(a._id) }}><Trash2 size={13} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="aa2-pagination">
              <span className="aa2-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="aa2-page-btns">
                <button className="aa2-page-btn" disabled={page === 1} onClick={function() { setPage(page - 1) }}>‹</button>
                {Array.from({ length: totalPages }).slice(0, 5).map(function(_, i) {
                  const p = i + 1
                  return <button key={p} className={'aa2-page-btn' + (page === p ? ' active' : '')} onClick={function() { setPage(p) }}>{p}</button>
                })}
                <button className="aa2-page-btn" disabled={page === totalPages} onClick={function() { setPage(page + 1) }}>›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}