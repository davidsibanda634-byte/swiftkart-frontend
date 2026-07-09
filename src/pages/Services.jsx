import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceCard from '../components/cards/ServiceCard'
import api from '../services/api'

const CATEGORIES = ['All', 'Tutoring', 'Design', 'Tech Help', 'Photography', 'Writing', 'Other']
const CATEGORY_ICONS = {
  'All': '🧑‍💼', 'Tutoring': '📚', 'Design': '🎨', 'Tech Help': '💻',
  'Photography': '📸', 'Writing': '✍️', 'Other': '📦',
}

export default function Services() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/services')
      .then(res => setServices(res.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = services.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase())
    const matchTab = activeTab === 'All' || s.category === activeTab
    return matchSearch && matchTab
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sv-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .sv-header {
          background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
          padding: 20px 16px 0;
        }
        .sv-header-inner { max-width: 1240px; margin: 0 auto; }
        .sv-back {
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.22);
          color: white; padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit;
          display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px;
          transition: all 0.2s;
        }
        .sv-back:hover { background: rgba(255,255,255,0.25); }
        .sv-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .sv-sub { color: rgba(255,255,255,0.75); font-size: 13.5px; margin: 0 0 16px; }

        .sv-search-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .sv-search-bar {
          flex: 1; display: flex; align-items: center;
          background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 11px; height: 44px; padding: 0 14px; gap: 8px; transition: all 0.2s;
        }
        .sv-search-bar:focus-within { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.5); }
        .sv-search-input {
          flex: 1; border: none; outline: none; font-size: 13px; color: white;
          font-family: inherit; background: transparent;
        }
        .sv-search-input::placeholder { color: rgba(255,255,255,0.5); }
        .sv-search-btn {
          height: 44px; padding: 0 18px;
          background: rgba(255,255,255,0.2); border: 1.5px solid rgba(255,255,255,0.3);
          color: white; border-radius: 11px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .sv-search-btn:hover { background: rgba(255,255,255,0.3); }

        .sv-cat-scroll {
          display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 14px;
        }
        .sv-cat-scroll::-webkit-scrollbar { display: none; }
        .sv-cat-chip {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          flex-shrink: 0; cursor: pointer; border: none; background: none;
          font-family: inherit; padding: 0; min-width: 60px; transition: transform 0.2s;
        }
        .sv-cat-chip:hover { transform: translateY(-2px); }
        .sv-cat-circle {
          width: 46px; height: 46px; border-radius: 14px;
          background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center; font-size: 20px; transition: all 0.2s;
        }
        .sv-cat-chip.active .sv-cat-circle {
          background: rgba(255,255,255,0.9); border-color: transparent;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .sv-cat-label {
          font-size: 9.5px; font-weight: 700; color: rgba(255,255,255,0.65);
          text-align: center; white-space: nowrap;
        }
        .sv-cat-chip.active .sv-cat-label { color: white; }

        .sv-content { max-width: 1240px; margin: 0 auto; padding: 20px 16px 80px; }

        .sv-count-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .sv-count-badge {
          display: inline-flex; align-items: center; gap: 7px; background: white;
          border: 1px solid #ddd6fe; border-radius: 20px; padding: 5px 14px;
          font-size: 12.5px; font-weight: 700; color: #5b21b6;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .sv-count-dot { width: 7px; height: 7px; border-radius: 50%; background: #7c3aed; flex-shrink: 0; }

        .sv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

        .sv-skeleton { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #f1f5f9; }
        .sv-skeleton-img {
          width: 100%; aspect-ratio: 1/1;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: sv-shimmer 1.4s infinite;
        }
        .sv-skeleton-line {
          height: 12px; margin: 12px 12px 8px; border-radius: 6px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: sv-shimmer 1.4s infinite;
        }
        @keyframes sv-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .sv-empty {
          grid-column: 1 / -1; text-align: center; padding: 60px 20px;
          background: white; border-radius: 16px; border: 2px dashed #e2e8f0;
        }
        .sv-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .sv-empty-title { font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 6px; }
        .sv-empty-sub { font-size: 13px; color: #9ca3af; }

        @media (max-width: 1024px) { .sv-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .sv-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .sv-content { padding: 16px 12px 80px; }
        }
      `}</style>

      <div className="sv-wrap">
        <div className="sv-header">
          <div className="sv-header-inner">
            <button className="sv-back" onClick={() => navigate(-1)}>← Back</button>
            <h1 className="sv-title">🧑‍💼 Student Services</h1>
            <p className="sv-sub">Find skilled students offering services on your campus</p>

            <div className="sv-search-row">
              <div className="sv-search-bar">
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>🔍</span>
                <input
                  className="sv-search-input"
                  type="text"
                  placeholder="Search services…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setSearch(e.target.value)}
                />
              </div>
              <button className="sv-search-btn" onClick={() => setSearch(search)}>Search</button>
            </div>

            <div className="sv-cat-scroll">
              {CATEGORIES.map(tab => (
                <button
                  key={tab}
                  className={'sv-cat-chip' + (activeTab === tab ? ' active' : '')}
                  onClick={() => setActiveTab(tab)}
                >
                  <div className="sv-cat-circle">{CATEGORY_ICONS[tab]}</div>
                  <span className="sv-cat-label">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sv-content">
          {!loading && (
            <div className="sv-count-row">
              <div className="sv-count-badge">
                <div className="sv-count-dot" />
                {filtered.length} service{filtered.length !== 1 ? 's' : ''} found
              </div>
            </div>
          )}

          <div className="sv-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="sv-skeleton">
                  <div className="sv-skeleton-img" />
                  <div className="sv-skeleton-line" />
                  <div className="sv-skeleton-line" style={{ width: '55%' }} />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="sv-empty">
                <div className="sv-empty-icon">🧑‍💼</div>
                <div className="sv-empty-title">No services found</div>
                <div className="sv-empty-sub">Try a different category or search term</div>
              </div>
            ) : (
              filtered.map(s => <ServiceCard key={s._id} service={s} onClick={() => navigate('/services/' + s._id)} />)
            )}
          </div>
        </div>
      </div>
    </>
  )
}