import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ListingCard from '../components/cards/ListingCard'
import api from '../services/api'

export default function Saved() {
  const { user, authReady } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authReady) return
    if (!user) { navigate('/login'); return }
    const key = 'sk_saved_' + user._id
    const ids = JSON.parse(localStorage.getItem(key) || '[]')
    setSavedIds(ids)
    if (ids.length === 0) { setLoading(false); return }
    api.get('/listings').then(res => {
      const saved = res.data.filter(l => ids.includes(l._id))
      setListings(saved)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user, authReady])

  const handleToggleSave = (id, isSaved) => {
    if (!isSaved) {
      setListings(prev => prev.filter(l => l._id !== id))
      setSavedIds(prev => prev.filter(sid => sid !== id))
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sv-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .sv-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 24px 32px; }
        .sv-header-inner { max-width: 1240px; margin: 0 auto; }
        .sv-back {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex;
          align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s;
        }
        .sv-back:hover { background: rgba(255,255,255,0.18); color: white; }

        .sv-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 5px; letter-spacing: -0.5px; }
        .sv-sub { color: rgba(255,255,255,0.55); font-size: 13.5px; margin: 0; }

        .sv-content { max-width: 1240px; margin: 0 auto; padding: 20px 20px 80px; }

        .sv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

        .sv-skeleton { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #f1f5f9; }
        .sv-skeleton-img {
          width: 100%; aspect-ratio: 4/5;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: sv-shimmer 1.4s infinite;
        }
        .sv-skeleton-line {
          height: 12px; margin: 12px 12px 8px; border-radius: 6px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: sv-shimmer 1.4s infinite;
        }
        .sv-skeleton-line.short { width: 55%; }
        @keyframes sv-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .sv-empty {
          text-align: center; padding: 80px 20px; background: white;
          border-radius: 20px; border: 2px dashed #e2e8f0; margin-top: 8px;
        }
        .sv-empty-icon { font-size: 56px; margin-bottom: 16px; }
        .sv-empty-title { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 8px; }
        .sv-empty-sub { font-size: 13.5px; color: #9ca3af; margin-bottom: 24px; line-height: 1.6; }
        .sv-browse-btn {
          background: linear-gradient(135deg, #08162F, #1e3a8a); color: white;
          border: none; padding: 12px 28px; border-radius: 12px; font-weight: 700;
          font-size: 14px; cursor: pointer; font-family: inherit; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(8,22,47,0.3);
        }
        .sv-browse-btn:hover { transform: translateY(-1px); }

        .sv-clear-btn {
          background: none; border: none; color: #9ca3af; font-size: 12.5px;
          font-weight: 700; cursor: pointer; font-family: inherit; padding: 4px 8px;
          transition: color 0.2s;
        }
        .sv-clear-btn:hover { color: #ef4444; }

        .sv-results-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-wrap: wrap; gap: 8px;
        }
        .sv-count-badge {
          display: inline-flex; align-items: center; gap: 7px; background: white;
          border: 1px solid #e2e8f0; border-radius: 20px; padding: 5px 14px;
          font-size: 12.5px; font-weight: 700; color: #374151;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .sv-count-dot { width: 7px; height: 7px; border-radius: 50%; background: #ef4444; flex-shrink: 0; }

        @media (max-width: 1024px) { .sv-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .sv-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .sv-content { padding: 16px 14px 80px; }
          .sv-header { padding: 20px 16px 24px; }
          .sv-title { font-size: 22px; }
        }
        @media (max-width: 480px) { .sv-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
      `}</style>

      <div className="sv-wrap">
        <div className="sv-header">
          <div className="sv-header-inner">
            <button className="sv-back" onClick={() => navigate(-1)}>← Back</button>
            <h1 className="sv-title">❤️ Saved Items</h1>
            <p className="sv-sub">Listings you've saved for later</p>
          </div>
        </div>

        <div className="sv-content">
          {loading ? (
            <div className="sv-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sv-skeleton">
                  <div className="sv-skeleton-img" />
                  <div className="sv-skeleton-line" />
                  <div className="sv-skeleton-line short" />
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="sv-empty">
              <div className="sv-empty-icon">🤍</div>
              <div className="sv-empty-title">No saved items yet</div>
              <div className="sv-empty-sub">
                Tap the ❤️ on any listing to save it here for later.
                Your saved items are stored on this device.
              </div>
              <button className="sv-browse-btn" onClick={() => navigate('/marketplace')}>
                Browse Marketplace
              </button>
            </div>
          ) : (
            <>
              <div className="sv-results-row">
                <div className="sv-count-badge">
                  <div className="sv-count-dot" />
                  {listings.length} saved listing{listings.length !== 1 ? 's' : ''}
                </div>
                <button className="sv-clear-btn" onClick={() => {
                  const key = 'sk_saved_' + user._id
                  localStorage.removeItem(key)
                  setListings([])
                  setSavedIds([])
                }}>
                  Clear All
                </button>
              </div>
              <div className="sv-grid">
                {listings.map(l => (
                  <ListingCard
                    key={l._id}
                    listing={l}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}