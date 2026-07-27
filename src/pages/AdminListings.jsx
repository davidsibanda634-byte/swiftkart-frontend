import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'

export default function AdminListings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const CATS = ['All', 'Fashion', 'Electronics', 'Cosmetics & Hair', 'Vehicles', 'Furniture', 'Food', 'Mobile & Accessories', 'Other']

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

  const filtered = listings.filter(function(l) {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.user?.name && l.user.name.toLowerCase().includes(search.toLowerCase()))
    const matchCat = category === 'All' || l.category === category
    return matchSearch && matchCat
  })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .al-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .al-search {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 12px; padding: 0 16px; height: 44px;
          margin-bottom: 16px; transition: all 0.2s;
        }
        .al-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .al-search input { border: none; outline: none; font-size: 13.5px; color: #374151; font-family: inherit; flex: 1; background: transparent; }

        .al-cats { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .al-cat-btn {
          padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e8ecf4;
          background: white; font-size: 12px; font-weight: 700; color: #6b7280;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .al-cat-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .al-cat-btn:hover:not(.active) { border-color: #00C896; color: #00C896; }

        .al-count { font-size: 13px; color: #9ca3af; font-weight: 600; margin-bottom: 16px; }

        .al-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .al-card {
          background: white; border-radius: 16px;
          overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9; transition: all 0.2s;
        }
        .al-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

        .al-card-img {
          width: 100%; aspect-ratio: 4/5;
          background: #f8fafc; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
        }
        .al-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .al-card-body { padding: 12px; }
        .al-card-title { font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .al-card-price { font-size: 15px; font-weight: 800; color: #00C896; margin: 0 0 3px; }
        .al-card-seller { font-size: 11px; color: #9ca3af; margin: 0 0 8px; }
        .al-card-cat {
          display: inline-block; font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 8px;
          background: #ecfdf5; color: #059669; margin-bottom: 10px;
        }
        .al-card-delete {
          width: 100%; background: #fef2f2; color: #dc2626;
          border: 1px solid #fecaca; padding: 7px; border-radius: 8px;
          font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .al-card-delete:hover { background: #fee2e2; }

        .al-empty { text-align: center; padding: 80px 20px; color: #9ca3af; font-size: 14px; }

        @media (max-width: 600px) {
          .al-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>

      <div className="al-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">🛍️ All Listings</h1>
          <p className="adm-page-sub">{listings.length} total listings on Scalablenexus</p>
        </div>

        <div className="al-search">
          <span style={{ color: '#9ca3af' }}>🔍</span>
          <input placeholder="Search by title or seller..." value={search}
            onChange={function(e) { setSearch(e.target.value) }} />
        </div>

        <div className="al-cats">
          {CATS.map(function(cat) {
            return (
              <button key={cat} className={'al-cat-btn' + (category === cat ? ' active' : '')}
                onClick={function() { setCategory(cat) }}>
                {cat}
              </button>
            )
          })}
        </div>

        <p className="al-count">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>

        {loading ? (
          <div className="al-empty">Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div className="al-empty">No listings found</div>
        ) : (
          <div className="al-grid">
            {filtered.map(function(l) {
              const imgUrl = getImg(l.images && l.images[0])
              return (
                <div key={l._id} className="al-card">
                  <div className="al-card-img">
                    {imgUrl
                      ? <img src={imgUrl} alt={l.title} />
                      : '🛍️'
                    }
                  </div>
                  <div className="al-card-body">
                    {l.category && <div className="al-card-cat">{l.category}</div>}
                    <p className="al-card-title">{l.title}</p>
                    <p className="al-card-price">{formatPrice(l.price)}</p>
                    <p className="al-card-seller">by {l.user?.name || 'Unknown'}</p>
                    <button className="al-card-delete" onClick={function() { deleteListing(l._id) }}>
                      🗑️ Delete Listing
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