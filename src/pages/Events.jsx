import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/cards/EventCard'
import api from '../services/api'

const EVENT_TYPES = ['All', 'Workshop', 'Concert', 'Social', 'Sport', 'Academic', 'Other']
const TYPE_ICONS = {
  'All': '🎉', 'Workshop': '🛠️', 'Concert': '🎵', 'Social': '🥳',
  'Sport': '⚽', 'Academic': '📚', 'Other': '📌'
}

export default function Events() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/events')
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase())
    const matchType = activeType === 'All' || e.category === activeType
    return matchSearch && matchType
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ev-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .ev-header {
          background: linear-gradient(135deg, #7c2d12 0%, #be185d 100%);
          padding: 20px 16px 0;
        }
        .ev-header-inner { max-width: 1240px; margin: 0 auto; }
        .ev-back {
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.22);
          color: white; padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit;
          display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px;
          transition: all 0.2s;
        }
        .ev-back:hover { background: rgba(255,255,255,0.25); }
        .ev-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .ev-sub { color: rgba(255,255,255,0.75); font-size: 13.5px; margin: 0 0 16px; }

        .ev-search-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .ev-search-bar {
          flex: 1; display: flex; align-items: center;
          background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 11px; height: 44px; padding: 0 14px; gap: 8px; transition: all 0.2s;
        }
        .ev-search-bar:focus-within { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.5); }
        .ev-search-input {
          flex: 1; border: none; outline: none; font-size: 13px; color: white;
          font-family: inherit; background: transparent;
        }
        .ev-search-input::placeholder { color: rgba(255,255,255,0.5); }
        .ev-search-btn {
          height: 44px; padding: 0 18px;
          background: rgba(255,255,255,0.2); border: 1.5px solid rgba(255,255,255,0.3);
          color: white; border-radius: 11px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .ev-search-btn:hover { background: rgba(255,255,255,0.3); }

        .ev-cat-scroll {
          display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 14px;
        }
        .ev-cat-scroll::-webkit-scrollbar { display: none; }
        .ev-cat-chip {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          flex-shrink: 0; cursor: pointer; border: none; background: none;
          font-family: inherit; padding: 0; min-width: 56px; transition: transform 0.2s;
        }
        .ev-cat-chip:hover { transform: translateY(-2px); }
        .ev-cat-circle {
          width: 46px; height: 46px; border-radius: 14px;
          background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center; font-size: 20px; transition: all 0.2s;
        }
        .ev-cat-chip.active .ev-cat-circle {
          background: rgba(255,255,255,0.9); border-color: transparent;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .ev-cat-label {
          font-size: 9.5px; font-weight: 700; color: rgba(255,255,255,0.65);
          text-align: center; white-space: nowrap;
        }
        .ev-cat-chip.active .ev-cat-label { color: white; }

        .ev-content { max-width: 1240px; margin: 0 auto; padding: 20px 16px 80px; }

        .ev-count-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .ev-count-badge {
          display: inline-flex; align-items: center; gap: 7px; background: white;
          border: 1px solid #fbcfe8; border-radius: 20px; padding: 5px 14px;
          font-size: 12.5px; font-weight: 700; color: #9d174d;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .ev-count-dot { width: 7px; height: 7px; border-radius: 50%; background: #be185d; flex-shrink: 0; }

        .ev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        .ev-skeleton { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #f1f5f9; }
        .ev-skeleton-img {
          width: 100%; aspect-ratio: 16/10;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: ev-shimmer 1.4s infinite;
        }
        .ev-skeleton-line {
          height: 12px; margin: 12px 12px 8px; border-radius: 6px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: ev-shimmer 1.4s infinite;
        }
        @keyframes ev-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .ev-empty {
          grid-column: 1 / -1; text-align: center; padding: 60px 20px;
          background: white; border-radius: 16px; border: 2px dashed #e2e8f0;
        }
        .ev-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .ev-empty-title { font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 6px; }
        .ev-empty-sub { font-size: 13px; color: #9ca3af; }

        @media (max-width: 1024px) { .ev-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .ev-grid { grid-template-columns: 1fr; gap: 12px; }
          .ev-content { padding: 16px 12px 80px; }
        }
      `}</style>

      <div className="ev-wrap">
        <div className="ev-header">
          <div className="ev-header-inner">
            <button className="ev-back" onClick={() => navigate(-1)}>← Back</button>
            <h1 className="ev-title">🎉 Upcoming Events</h1>
            <p className="ev-sub">Discover workshops, meetups and campus activities</p>

            <div className="ev-search-row">
              <div className="ev-search-bar">
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>🔍</span>
                <input
                  className="ev-search-input"
                  type="text"
                  placeholder="Search events…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setSearch(e.target.value)}
                />
              </div>
              <button className="ev-search-btn" onClick={() => setSearch(search)}>Search</button>
            </div>

            <div className="ev-cat-scroll">
              {EVENT_TYPES.map(type => (
                <button
                  key={type}
                  className={'ev-cat-chip' + (activeType === type ? ' active' : '')}
                  onClick={() => setActiveType(type)}
                >
                  <div className="ev-cat-circle">{TYPE_ICONS[type]}</div>
                  <span className="ev-cat-label">{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ev-content">
          {!loading && (
            <div className="ev-count-row">
              <div className="ev-count-badge">
                <div className="ev-count-dot" />
                {filtered.length} event{filtered.length !== 1 ? 's' : ''} coming up
              </div>
            </div>
          )}

          <div className="ev-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="ev-skeleton">
                  <div className="ev-skeleton-img" />
                  <div className="ev-skeleton-line" />
                  <div className="ev-skeleton-line" style={{ width: '60%' }} />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="ev-empty">
                <div className="ev-empty-icon">🎉</div>
                <div className="ev-empty-title">No events found</div>
                <div className="ev-empty-sub">Check back soon for upcoming events</div>
              </div>
            ) : (
              filtered.map(e => <EventCard key={e._id} event={e} onClick={() => navigate('/events/' + e._id)} />)
            )}
          </div>
        </div>
      </div>
    </>
  )
}