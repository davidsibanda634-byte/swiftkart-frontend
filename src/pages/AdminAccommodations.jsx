import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'

export default function AdminAccommodations() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [accommodations, setAccommodations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [propertyType, setPropertyType] = useState('All')

  const TYPES = ['All', 'Room', 'Studio', 'Apartment', 'House', 'Cottage', 'Flat', 'Other']

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

  const filtered = accommodations.filter(function(a) {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.user?.name && a.user.name.toLowerCase().includes(search.toLowerCase()))
    const matchType = propertyType === 'All' || a.propertyType === propertyType
    return matchSearch && matchType
  })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .aa2-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .aa2-search {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 12px; padding: 0 16px; height: 44px;
          margin-bottom: 16px; transition: all 0.2s;
        }
        .aa2-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .aa2-search input { border: none; outline: none; font-size: 13.5px; color: #374151; font-family: inherit; flex: 1; background: transparent; }

        .aa2-cats { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .aa2-cat-btn {
          padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e8ecf4;
          background: white; font-size: 12px; font-weight: 700; color: #6b7280;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .aa2-cat-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .aa2-cat-btn:hover:not(.active) { border-color: #00C896; color: #00C896; }

        .aa2-count { font-size: 13px; color: #9ca3af; font-weight: 600; margin-bottom: 16px; }

        .aa2-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .aa2-card {
          background: white; border-radius: 16px;
          overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9; transition: all 0.2s;
        }
        .aa2-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

        .aa2-card-img {
          width: 100%; aspect-ratio: 4/3;
          background: #eff6ff; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px; position: relative;
        }
        .aa2-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .aa2-card-listing-type {
          position: absolute; top: 8px; left: 8px; font-size: 9.5px; font-weight: 800;
          padding: 3px 9px; border-radius: 20px; color: white;
        }

        .aa2-card-body { padding: 12px; }
        .aa2-card-title { font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .aa2-card-price { font-size: 15px; font-weight: 800; color: #2563EB; margin: 0 0 3px; }
        .aa2-card-price span { font-size: 11px; color: #9ca3af; font-weight: 500; }
        .aa2-card-meta { font-size: 11px; color: #9ca3af; margin: 0 0 3px; }
        .aa2-card-seller { font-size: 11px; color: #9ca3af; margin: 0 0 8px; }
        .aa2-card-type {
          display: inline-block; font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 8px;
          background: #eff6ff; color: #2563EB; margin-bottom: 10px;
        }
        .aa2-card-delete {
          width: 100%; background: #fef2f2; color: #dc2626;
          border: 1px solid #fecaca; padding: 7px; border-radius: 8px;
          font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .aa2-card-delete:hover { background: #fee2e2; }

        .aa2-empty { text-align: center; padding: 80px 20px; color: #9ca3af; font-size: 14px; }

        @media (max-width: 600px) {
          .aa2-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>

      <div className="aa2-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">🏠 All Properties</h1>
          <p className="adm-page-sub">{accommodations.length} total properties on Scalablenexus</p>
        </div>

        <div className="aa2-search">
          <span style={{ color: '#9ca3af' }}>🔍</span>
          <input placeholder="Search by title or lister..." value={search}
            onChange={function(e) { setSearch(e.target.value) }} />
        </div>

        <div className="aa2-cats">
          {TYPES.map(function(t) {
            return (
              <button key={t} className={'aa2-cat-btn' + (propertyType === t ? ' active' : '')}
                onClick={function() { setPropertyType(t) }}>
                {t}
              </button>
            )
          })}
        </div>

        <p className="aa2-count">{filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'} found</p>

        {loading ? (
          <div className="aa2-empty">Loading properties...</div>
        ) : filtered.length === 0 ? (
          <div className="aa2-empty">No properties found</div>
        ) : (
          <div className="aa2-grid">
            {filtered.map(function(a) {
              const imgUrl = getImg(a.images && a.images[0])
              const isForSale = a.listingType === 'For Sale'
              return (
                <div key={a._id} className="aa2-card">
                  <div className="aa2-card-img">
                    <span className="aa2-card-listing-type" style={{ background: isForSale ? '#d97706' : '#00C896' }}>
                      {a.listingType || 'For Rent'}
                    </span>
                    {imgUrl ? <img src={imgUrl} alt={a.title} /> : '🏠'}
                  </div>
                  <div className="aa2-card-body">
                    {a.propertyType && <div className="aa2-card-type">{a.propertyType}</div>}
                    <p className="aa2-card-title">{a.title}</p>
                    <p className="aa2-card-price">
                      {formatPrice(a.price)} <span>{a.priceType || ''}</span>
                    </p>
                    <p className="aa2-card-meta">
                      {a.bedrooms || 0} bed · {a.bathrooms || 0} bath · {a.furnished || 'Unfurnished'}
                    </p>
                    <p className="aa2-card-seller">by {a.user?.name || 'Unknown'}</p>
                    <button className="aa2-card-delete" onClick={function() { deleteAccommodation(a._id) }}>
                      🗑️ Delete Property
                    </button>
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