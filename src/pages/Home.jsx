import Hero from '../components/Hero'
import ListingCard from '../components/cards/ListingCard'
import { useEffect, useState, useCallback } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Home() {
  const [listings, setListings] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const LIMIT = 8

  const fetchListings = useCallback(async (pageNum) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await api.get('/listings')
      const all = res.data
      const start = (pageNum - 1) * LIMIT
      const chunk = all.slice(start, start + LIMIT)
      if (pageNum === 1) {
        setListings(chunk)
      } else {
        setListings(prev => [...prev, ...chunk])
      }
      setHasMore(start + LIMIT < all.length)
    } catch (e) {
      // silent
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [])

  useEffect(() => {
    fetchListings(1)
  }, [])

  useEffect(() => {
    if (page === 1) return
    fetchListings(page)
  }, [page])

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 400
        && hasMore && !loading
      ) {
        setPage(prev => prev + 1)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loading])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-home {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f4f7fb;
          min-height: 100vh;
        }
        .sk-content {
          max-width: 1240px;
          margin: 0 auto;
          padding: 28px 20px 60px;
        }
        .sk-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .sk-section-left { display: flex; align-items: center; gap: 10px; }
        .sk-section-dot {
          width: 5px;
          height: 24px;
          background: linear-gradient(180deg, #1e4db7, #10b981);
          border-radius: 3px;
          flex-shrink: 0;
        }
        .sk-section-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.3px;
        }
        .sk-section-sub {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          margin-top: 1px;
        }
        .sk-view-all {
          color: #1e4db7;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1.5px solid #c7d7ff;
          background: white;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .sk-view-all:hover { background: #eff6ff; border-color: #1e4db7; }

        .sk-listing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .sk-skeleton {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
        }
        .sk-skeleton-img {
          width: 100%;
          aspect-ratio: 1/1;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: sk-shimmer 1.4s infinite;
        }
        .sk-skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: sk-shimmer 1.4s infinite;
          margin: 12px 12px 8px;
        }
        .sk-skeleton-line.short { width: 50%; }
        @keyframes sk-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .sk-load-more {
          display: flex;
          justify-content: center;
          padding: 28px 0 0;
        }
        .sk-load-more-btn {
          background: white;
          color: #1e4db7;
          border: 1.5px solid #c7d7ff;
          padding: 11px 32px;
          border-radius: 25px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .sk-load-more-btn:hover { background: #eff6ff; border-color: #1e4db7; }

        .sk-spinner {
          display: flex;
          justify-content: center;
          padding: 24px 0;
        }
        .sk-spinner-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1e4db7;
          margin: 0 3px;
          animation: sk-bounce 1.2s infinite ease-in-out;
        }
        .sk-spinner-dot:nth-child(2) { animation-delay: 0.16s; }
        .sk-spinner-dot:nth-child(3) { animation-delay: 0.32s; }
        @keyframes sk-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .sk-end-msg {
          text-align: center;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
          padding: 24px 0 0;
        }

        .sk-empty {
          color: #94a3b8;
          font-size: 14px;
          padding: 40px;
          background: white;
          border-radius: 14px;
          text-align: center;
          border: 2px dashed #e2e8f0;
          grid-column: 1 / -1;
        }

        @media (max-width: 1024px) {
          .sk-listing-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .sk-listing-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .sk-content { padding: 20px 14px 60px; }
          .sk-section-title { font-size: 16px; }
        }
        @media (max-width: 480px) {
          .sk-listing-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>

      <div className="sk-home">
        <Hero />

        <div className="sk-content">
          <div className="sk-section-header">
            <div className="sk-section-left">
              <div className="sk-section-dot" />
              <div>
                <div className="sk-section-title">🛍️ Featured Listings</div>
                <div className="sk-section-sub">Latest deals from campus sellers</div>
              </div>
            </div>
            <Link to="/marketplace" className="sk-view-all">View All →</Link>
          </div>

          <div className="sk-listing-grid">
            {initialLoad ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="sk-skeleton">
                  <div className="sk-skeleton-img" />
                  <div className="sk-skeleton-line" />
                  <div className="sk-skeleton-line short" />
                </div>
              ))
            ) : listings.length > 0 ? (
              listings.map(l => <ListingCard key={l._id} listing={l} />)
            ) : (
              <p className="sk-empty">No listings yet. Be the first to post!</p>
            )}
          </div>

          {loading && !initialLoad && (
            <div className="sk-spinner">
              <div className="sk-spinner-dot" />
              <div className="sk-spinner-dot" />
              <div className="sk-spinner-dot" />
            </div>
          )}

          {!hasMore && listings.length > 0 && (
            <p className="sk-end-msg">✅ You've seen all listings</p>
          )}
        </div>
      </div>
    </>
  )
}