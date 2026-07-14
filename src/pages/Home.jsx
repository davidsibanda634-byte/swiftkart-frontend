import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import ListingCard from '../components/cards/ListingCard'
import api from '../services/api'

export default function Home() {
  const navigate = useNavigate()
  const [allListings, setAllListings] = useState([])
  const [displayed, setDisplayed] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const loaderRef = useRef(null)
  const PAGE_SIZE = 8

  useEffect(() => {
    const rv = JSON.parse(localStorage.getItem('sk_recently_viewed') || '[]')
    setRecentlyViewed(rv)

    api.get('/listings').then(res => {
      const data = res.data
      setAllListings(data)
      setDisplayed(data.slice(0, PAGE_SIZE))
      setHasMore(data.length > PAGE_SIZE)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!loaderRef.current) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const next = page + 1
        setPage(next)
        setDisplayed(allListings.slice(0, next * PAGE_SIZE))
        setHasMore(allListings.length > next * PAGE_SIZE)
      }
    }, { threshold: 0.1 })
    obs.observe(loaderRef.current)
    return () => obs.disconnect()
  }, [loaderRef, hasMore, page, allListings])

  const handleToggleSave = (id, isSaved) => {
    setSavedIds(prev => isSaved ? [...prev, id] : prev.filter(s => s !== id))
  }

  // Just Dropped — listings posted in the last 6 hours
  const justDropped = allListings.filter(l => {
    const hoursOld = (new Date() - new Date(l.createdAt)) / (1000 * 60 * 60)
    return hoursOld <= 6
  })

  // Featured — most recent 4
  const featured = allListings.slice(0, 4)

  const SkeletonCard = () => (
    <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
      <div style={{ width: '100%', aspectRatio: '4/5', background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ padding: '10px' }}>
        <div style={{ height: '12px', background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', borderRadius: '6px', marginBottom: '8px' }} />
        <div style={{ height: '12px', width: '55%', background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', borderRadius: '6px' }} />
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .home-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; }

        /* ── Just Dropped strip ── */
        .jd-strip {
          background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
          padding: 18px 20px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .jd-strip-inner { max-width: 1240px; margin: 0 auto; }
        .jd-strip-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
        }
        .jd-strip-left { display: flex; align-items: center; gap: 10px; }
        .jd-live-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #00C896;
          animation: jd-pulse 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes jd-pulse {
          0% { box-shadow: 0 0 0 0 rgba(0,200,150,0.4); }
          70% { box-shadow: 0 0 0 8px rgba(0,200,150,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,200,150,0); }
        }
        .jd-strip-title { font-size: 15px; font-weight: 800; color: white; margin: 0; }
        .jd-strip-sub { font-size: 11px; color: rgba(255,255,255,0.45); font-weight: 500; margin: 2px 0 0; }
        .jd-view-all {
          font-size: 12px; font-weight: 700; color: #00C896; background: none; border: none;
          cursor: pointer; font-family: inherit; transition: opacity 0.2s; white-space: nowrap;
        }
        .jd-view-all:hover { opacity: 0.75; }

        .jd-scroll {
          display: flex; gap: 12px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px;
        }
        .jd-scroll::-webkit-scrollbar { display: none; }

        .jd-card-wrap { position: relative; flex-shrink: 0; }
        .jd-card {
          width: 140px; background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; overflow: hidden;
          cursor: pointer; transition: all 0.2s;
        }
        .jd-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.12); }
        .jd-card-img { width: 100%; height: 140px; object-fit: cover; display: block; }
        .jd-card-no-img {
          width: 100%; height: 140px; display: flex; align-items: center;
          justify-content: center; font-size: 36px; background: rgba(255,255,255,0.05);
        }
        .jd-card-body { padding: 10px; }
        .jd-card-title {
          font-size: 11.5px; font-weight: 700; color: white; margin: 0 0 4px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .jd-card-price { font-size: 12px; font-weight: 800; color: #00C896; margin: 0 0 4px; }
        .jd-card-time { font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 500; margin: 0; }
        .jd-new-badge {
          position: absolute; top: 8px; left: 8px; z-index: 1;
          background: #00C896; color: white; font-size: 8.5px; font-weight: 800;
          padding: 2px 7px; border-radius: 20px; letter-spacing: 0.3px;
        }

        /* ── Section headers ── */
        .home-section { max-width: 1240px; margin: 0 auto; padding: 24px 20px 0; }
        .home-section-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
        }
        .home-section-left { display: flex; align-items: center; gap: 10px; }
        .home-section-bar { width: 4px; height: 22px; border-radius: 3px; flex-shrink: 0; }
        .home-section-title { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0; }
        .home-section-sub { font-size: 12.5px; color: #9ca3af; margin: 2px 0 0; }
        .home-view-all {
          font-size: 12.5px; font-weight: 700; color: #00C896; background: none; border: none;
          cursor: pointer; font-family: inherit; transition: opacity 0.2s; white-space: nowrap;
          display: inline-flex; align-items: center; gap: 4px;
        }
        .home-view-all:hover { opacity: 0.75; }

        /* ── Grid ── */
        .home-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

        /* ── Recently Viewed ── */
        .rv-scroll { display: flex; gap: 12px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .rv-scroll::-webkit-scrollbar { display: none; }
        .rv-card {
          flex-shrink: 0; width: 140px; background: white; border-radius: 14px; overflow: hidden;
          border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .rv-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .rv-card-img { width: 100%; height: 140px; object-fit: cover; display: block; }
        .rv-card-no-img { width: 100%; height: 140px; display: flex; align-items: center; justify-content: center; font-size: 36px; background: #f8fafc; }
        .rv-card-body { padding: 10px; }
        .rv-card-title { font-size: 11.5px; font-weight: 700; color: #111827; margin: 0 0 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rv-card-price { font-size: 12px; font-weight: 800; color: #00C896; margin: 0; }

        .home-loader { text-align: center; padding: 30px; color: #9ca3af; font-size: 13px; }

        @media (max-width: 1024px) { .home-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .home-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .home-section { padding: 16px 14px 0; }
          .jd-strip { padding: 14px 14px 18px; }
        }
        @media (max-width: 480px) { .home-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
      `}</style>

      <div className="home-wrap">
        <Hero />

        {/* ── Just Dropped Strip ── */}
        {!loading && justDropped.length > 0 && (
          <div className="jd-strip">
            <div className="jd-strip-inner">
              <div className="jd-strip-header">
                <div className="jd-strip-left">
                  <div className="jd-live-dot" />
                  <div>
                    <p className="jd-strip-title">⚡ Just Dropped</p>
                    <p className="jd-strip-sub">Posted in the last 6 hours — fresh listings</p>
                  </div>
                </div>
                <button className="jd-view-all" onClick={() => navigate('/marketplace')}>
                  See all →
                </button>
              </div>

              <div className="jd-scroll">
                {justDropped.map(l => {
                  const img = l.images?.[0]
                  const minsAgo = Math.floor((new Date() - new Date(l.createdAt)) / (1000 * 60))
                  const timeLabel = minsAgo < 60
                    ? minsAgo + ' min' + (minsAgo !== 1 ? 's' : '') + ' ago'
                    : Math.floor(minsAgo / 60) + ' hr' + (Math.floor(minsAgo / 60) !== 1 ? 's' : '') + ' ago'

                  return (
                    <div key={l._id} className="jd-card-wrap" onClick={() => navigate('/listings/' + l._id)}>
                      <span className="jd-new-badge">NEW</span>
                      <div className="jd-card">
                        {img
                          ? <img className="jd-card-img" src={img} alt={l.title} />
                          : <div className="jd-card-no-img">🛍️</div>
                        }
                        <div className="jd-card-body">
                          <p className="jd-card-title">{l.title}</p>
                          <p className="jd-card-price">${l.price}</p>
                          <p className="jd-card-time">🕐 {timeLabel}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Featured Listings ── */}
        <div className="home-section" style={{ paddingTop: '28px' }}>
          <div className="home-section-header">
            <div className="home-section-left">
              <div className="home-section-bar" style={{ background: 'linear-gradient(180deg,#00C896,#059669)' }} />
              <div>
                <p className="home-section-title">🔥 Featured Listings</p>
                <p className="home-section-sub">Latest deals from your community</p>
              </div>
            </div>
            <button className="home-view-all" onClick={() => navigate('/marketplace')}>
              View All →
            </button>
          </div>

          {loading ? (
            <div className="home-grid">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="home-grid">
              {featured.map(l => (
                <ListingCard key={l._id} listing={l} savedIds={savedIds} onToggleSave={handleToggleSave} />
              ))}
            </div>
          )}
        </div>

        {/* ── Recently Viewed ── */}
        {recentlyViewed.length > 0 && (
          <div className="home-section" style={{ paddingTop: '28px' }}>
            <div className="home-section-header">
              <div className="home-section-left">
                <div className="home-section-bar" style={{ background: 'linear-gradient(180deg,#7c3aed,#6d28d9)' }} />
                <div>
                  <p className="home-section-title">👁️ Recently Viewed</p>
                  <p className="home-section-sub">Pick up where you left off</p>
                </div>
              </div>
              <button
                className="home-view-all"
                style={{ color: '#7c3aed' }}
                onClick={() => {
                  localStorage.removeItem('sk_recently_viewed')
                  setRecentlyViewed([])
                }}
              >
                Clear
              </button>
            </div>

            <div className="rv-scroll">
              {recentlyViewed.map(item => (
                <div key={item._id} className="rv-card" onClick={() => navigate('/listings/' + item._id)}>
                  {item.image
                    ? <img className="rv-card-img" src={item.image} alt={item.title} />
                    : <div className="rv-card-no-img">🛍️</div>
                  }
                  <div className="rv-card-body">
                    <p className="rv-card-title">{item.title}</p>
                    <p className="rv-card-price">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── All Listings — infinite scroll ── */}
        <div className="home-section" style={{ paddingTop: '28px', paddingBottom: '80px' }}>
          <div className="home-section-header">
            <div className="home-section-left">
              <div className="home-section-bar" style={{ background: 'linear-gradient(180deg,#d97706,#b45309)' }} />
              <div>
                <p className="home-section-title">🛍️ All Listings</p>
                <p className="home-section-sub">{allListings.length} items from your community</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="home-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              <div className="home-grid">
                {displayed.map(l => (
                  <ListingCard key={l._id} listing={l} savedIds={savedIds} onToggleSave={handleToggleSave} />
                ))}
              </div>
              {hasMore && (
                <div ref={loaderRef} className="home-loader">Loading more...</div>
              )}
              {!hasMore && allListings.length > 0 && (
                <div className="home-loader">✅ You've seen all listings</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}