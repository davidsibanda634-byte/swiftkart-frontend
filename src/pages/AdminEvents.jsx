import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../layouts/AdminLayout'
import api from '../services/api'
import { formatPrice } from '../utils/format'

export default function AdminEvents() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

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

  const filtered = events.filter(function(e) {
    return e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location && e.location.toLowerCase().includes(search.toLowerCase())) ||
      (e.user?.name && e.user.name.toLowerCase().includes(search.toLowerCase()))
  })

  return (
    <AdminLayout stats={stats}>
      <style>{`
        .ae-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .ae-search {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid #e8ecf4;
          border-radius: 12px; padding: 0 16px; height: 44px;
          margin-bottom: 20px; transition: all 0.2s;
        }
        .ae-search:focus-within { border-color: #00C896; box-shadow: 0 0 0 3px rgba(0,200,150,0.1); }
        .ae-search input { border: none; outline: none; font-size: 13.5px; color: #374151; font-family: inherit; flex: 1; background: transparent; }

        .ae-count { font-size: 13px; color: #9ca3af; font-weight: 600; margin-bottom: 16px; }

        .ae-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .ae-card {
          background: white; border-radius: 16px;
          overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9; transition: all 0.2s;
        }
        .ae-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

        .ae-card-img {
          width: 100%; aspect-ratio: 16/10;
          background: #fdf2f8; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
        }
        .ae-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .ae-card-body { padding: 14px; }
        .ae-card-date {
          display: inline-block; font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 8px;
          background: #fdf2f8; color: #EC4899; margin-bottom: 8px;
        }
        .ae-card-title { font-size: 14px; font-weight: 700; color: #111827; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ae-card-meta { font-size: 11.5px; color: #9ca3af; margin: 0 0 3px; }
        .ae-card-price { font-size: 13px; font-weight: 800; color: #EC4899; margin: 0 0 10px; }
        .ae-card-delete {
          width: 100%; background: #fef2f2; color: #dc2626;
          border: 1px solid #fecaca; padding: 7px; border-radius: 8px;
          font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .ae-card-delete:hover { background: #fee2e2; }

        .ae-empty { text-align: center; padding: 80px 20px; color: #9ca3af; font-size: 14px; }

        @media (max-width: 600px) {
          .ae-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ae-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">🎉 All Events</h1>
          <p className="adm-page-sub">{events.length} total events on Scalablenexus</p>
        </div>

        <div className="ae-search">
          <span style={{ color: '#9ca3af' }}>🔍</span>
          <input placeholder="Search by title, location or organizer..." value={search}
            onChange={function(e) { setSearch(e.target.value) }} />
        </div>

        <p className="ae-count">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</p>

        {loading ? (
          <div className="ae-empty">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="ae-empty">No events found</div>
        ) : (
          <div className="ae-grid">
            {filtered.map(function(e) {
              const imgUrl = getImg(e.images && e.images[0])
              const dateLabel = e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBA'
              return (
                <div key={e._id} className="ae-card">
                  <div className="ae-card-img">
                    {imgUrl
                      ? <img src={imgUrl} alt={e.title} />
                      : '🎉'
                    }
                  </div>
                  <div className="ae-card-body">
                    <div className="ae-card-date">{dateLabel}</div>
                    <p className="ae-card-title">{e.title}</p>
                    <p className="ae-card-meta">{e.location || 'Location TBA'} · by {e.user?.name || 'Unknown'}</p>
                    <p className="ae-card-price">{e.price ? formatPrice(e.price) : 'Free'}</p>
                    <button className="ae-card-delete" onClick={function() { deleteEvent(e._id) }}>
                      🗑️ Delete Event
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