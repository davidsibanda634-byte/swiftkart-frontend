import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'

export default function AdminServices() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const CATS = ['All', 'Tutoring', 'Design', 'Photography', 'Writing', 'Tech Help', 'Other']

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

  const filtered = services.filter(function(s) {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.user?.name && s.user.name.toLowerCase().includes(search.toLowerCase()))
    const matchCat = category === 'All' || s.category === category
    return matchSearch && matchCat
  })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .as-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .as-search {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 12px; padding: 0 16px; height: 44px;
          margin-bottom: 16px; transition: all 0.2s;
        }
        .as-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .as-search input { border: none; outline: none; font-size: 13.5px; color: #374151; font-family: inherit; flex: 1; background: transparent; }

        .as-cats { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .as-cat-btn {
          padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e8ecf4;
          background: white; font-size: 12px; font-weight: 700; color: #6b7280;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .as-cat-btn.active { background: #08162F; color: white; border-color: #08162F; }
        .as-cat-btn:hover:not(.active) { border-color: #00C896; color: #00C896; }

        .as-count { font-size: 13px; color: #9ca3af; font-weight: 600; margin-bottom: 16px; }

        .as-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .as-card {
          background: white; border-radius: 16px;
          overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9; transition: all 0.2s;
        }
        .as-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

        .as-card-img {
          width: 100%; aspect-ratio: 4/5;
          background: #f5f3ff; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
        }
        .as-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .as-card-body { padding: 12px; }
        .as-card-title { font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .as-card-price { font-size: 15px; font-weight: 800; color: #7C3AED; margin: 0 0 3px; }
        .as-card-seller { font-size: 11px; color: #9ca3af; margin: 0 0 8px; }
        .as-card-cat {
          display: inline-block; font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 8px;
          background: #f5f3ff; color: #7C3AED; margin-bottom: 10px;
        }
        .as-card-delete {
          width: 100%; background: #fef2f2; color: #dc2626;
          border: 1px solid #fecaca; padding: 7px; border-radius: 8px;
          font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .as-card-delete:hover { background: #fee2e2; }

        .as-empty { text-align: center; padding: 80px 20px; color: #9ca3af; font-size: 14px; }

        @media (max-width: 600px) {
          .as-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>

      <div className="as-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">🧑‍💼 All Services</h1>
          <p className="adm-page-sub">{services.length} total services on Scalablenexus</p>
        </div>

        <div className="as-search">
          <span style={{ color: '#9ca3af' }}>🔍</span>
          <input placeholder="Search by title or provider..." value={search}
            onChange={function(e) { setSearch(e.target.value) }} />
        </div>

        <div className="as-cats">
          {CATS.map(function(cat) {
            return (
              <button key={cat} className={'as-cat-btn' + (category === cat ? ' active' : '')}
                onClick={function() { setCategory(cat) }}>
                {cat}
              </button>
            )
          })}
        </div>

        <p className="as-count">{filtered.length} service{filtered.length !== 1 ? 's' : ''} found</p>

        {loading ? (
          <div className="as-empty">Loading services...</div>
        ) : filtered.length === 0 ? (
          <div className="as-empty">No services found</div>
        ) : (
          <div className="as-grid">
            {filtered.map(function(s) {
              const imgUrl = getImg(s.images && s.images[0])
              return (
                <div key={s._id} className="as-card">
                  <div className="as-card-img">
                    {imgUrl
                      ? <img src={imgUrl} alt={s.title} />
                      : '🧑‍💼'
                    }
                  </div>
                  <div className="as-card-body">
                    {s.category && <div className="as-card-cat">{s.category}</div>}
                    <p className="as-card-title">{s.title}</p>
                    <p className="as-card-price">{formatPrice(s.pricePerHour)}/hr</p>
                    <p className="as-card-seller">by {s.user?.name || 'Unknown'}</p>
                    <button className="as-card-delete" onClick={function() { deleteService(s._id) }}>
                      🗑️ Delete Service
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