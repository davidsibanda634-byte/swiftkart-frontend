import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceCard from '../components/cards/ServiceCard'
import api from '../services/api'

const CATEGORIES = ['All', 'Tutoring', 'Design', 'Tech Help', 'Photography', 'Writing', 'Other']
const CATEGORY_ICONS = {
  All: '🧑‍💼', Tutoring: '📚', Design: '🎨', 'Tech Help': '💻',
  Photography: '📸', Writing: '✍️', Other: '📦',
}

export default function Services() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/services')
        setServices(data)
      } catch {
        setServices([])
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
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
          padding: 28px 24px 32px;
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
        .sv-sub { color: rgba(255,255,255,0.75); font-size: 13.5px; margin: 0 0 22px; }

        .sv-search-bar {
          display: flex; align-items: center; background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25); border-radius: 12px;
          height: 46px; padding: 0 16px; gap: 9px; max-width: 600px; transition: all 0.2s;
        }
        .sv-search-bar:focus-within { background: rgba(255,255,255,0.22); box-shadow: 0 0 0 3px rgba(255,255,255,0.15); }
        .sv-search-input {
          flex: 1; border: none; outline: none; font-size: 13.5px; color: white;
          font-family: inherit; background: transparent;
        }
        .sv-search-input::placeholder { color: rgba(255,255,255,0.55); }

        .sv-content { max-width: 1240px; margin: 0 auto; padding: 20px 20px 60px; }

        .sv-filter-bar {
          background: white; border-radius: 14px; padding: 14px 16px; margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          display: flex; gap: 6px; flex-wrap: wrap;
        }

        .sv-cat-pill {
          padding: 7px 14px; border-radius: 20px; border: 1.5px solid #e2e8f0;
          background: white; color: #4b5563; font-size: 12.5px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
          display: flex; align-items: center; gap: 5px; white-space: nowrap;
        }
        .sv-cat-pill:hover { border-color: #7c3aed; color: #6d28d9; background: #f5f3ff; }
        .sv-cat-pill.active {
          background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white;
          border-color: transparent; box-shadow: 0 3px 10px rgba(124,58,237,0.3);
        }

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

        @media (max-width: 1024px) {
          .sv-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .sv-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .sv-header { padding: 20px 16px 24px; }
          .sv-content { padding: 16px 14px 60px; }
        }
      `}</style>

      <div className="sv-wrap">
        <div className="sv-header">
          <div className="sv-header-inner">
            <button className="sv-back" onClick={() => navigate(-1)}>← Back</button>
            <h1 className="sv-title">🧑‍💼 Student Services</h1>
            <p className="sv-sub">Find skilled students offering services on your campus</p>

            <div className="sv-search-bar">
              <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)' }}>🔍</span>
              <input
                className="sv-search-input"
                type="text"
                placeholder="Search services…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="sv-content">
          <div className="sv-filter-bar">
            {CATEGORIES.map(tab => (
              <button
                key={tab}
                className={'sv-cat-pill' + (activeTab === tab ? ' active' : '')}
                onClick={() => setActiveTab(tab)}
              >
                <span>{CATEGORY_ICONS[tab]}</span>
                <span>{tab}</span>
              </button>
            ))}
          </div>

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
              filtered.map(s => <ServiceCard key={s._id} service={s} />)
            )}
          </div>
        </div>
      </div>
    </>
  )
}