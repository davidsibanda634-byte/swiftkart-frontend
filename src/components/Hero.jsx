import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SLIDES = [
  {
    badge: '🛍️ CAMPUS MARKETPLACE',
    title: 'Find Amazing Deals\nAround Campus',
    sub: 'Buy and sell fashion, electronics, furniture, accessories and more.',
    cta: 'Explore Marketplace',
    to: '/marketplace',
    bg: 'linear-gradient(135deg, rgba(8,22,47,0.88) 0%, rgba(0,200,150,0.25) 100%), url("https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80")',
    accent: '#00C896',
  },
  {
    badge: '🧑‍💼 STUDENT SERVICES',
    title: 'Need a Service?\nFind Trusted Talent',
    sub: 'Discover tutors, designers, photographers and student service providers.',
    cta: 'Browse Services',
    to: '/services',
    bg: 'linear-gradient(135deg, rgba(8,22,47,0.88) 0%, rgba(37,99,235,0.25) 100%), url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80")',
    accent: '#2563EB',
  },
  {
    badge: '💼 JOBS & OPPORTUNITIES',
    title: 'Discover Jobs &\nSide Hustles',
    sub: 'Find internships, part-time jobs, freelance gigs and campus opportunities.',
    cta: 'Browse Jobs',
    to: '/jobs',
    bg: 'linear-gradient(135deg, rgba(8,22,47,0.88) 0%, rgba(124,58,237,0.25) 100%), url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80")',
    accent: '#7C3AED',
  },
  {
    badge: '🎉 CAMPUS EVENTS',
    title: "What's Happening\nOn Campus?",
    sub: 'Discover workshops, social gatherings, concerts and campus activities.',
    cta: 'Explore Events',
    to: '/events',
    bg: 'linear-gradient(135deg, rgba(8,22,47,0.88) 0%, rgba(245,158,11,0.25) 100%), url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80")',
    accent: '#F59E0B',
  },
]

const CATEGORIES = [
  { icon: '👗', label: 'Fashion', category: 'Fashion' },
  { icon: '📱', label: 'Electronics', category: 'Electronics' },
  { icon: '💄', label: 'Cosmetics', category: 'Cosmetics & Hair' },
  { icon: '🚗', label: 'Vehicles', category: 'Vehicles' },
  { icon: '🛋️', label: 'Furniture', category: 'Furniture' },
  { icon: '🍔', label: 'Food', category: 'Food' },
  { icon: '🧑‍💼', label: 'Services', category: null, to: '/services' },
  { icon: '💼', label: 'Jobs', category: null, to: '/jobs' },
  { icon: '📦', label: 'Other', category: 'Other' },
]

const TRUST_ITEMS = [
  { icon: '🛡️', bg: 'rgba(0,200,150,0.15)', label: 'Verified Sellers', sub: 'Trusted community' },
  { icon: '💬', bg: 'rgba(0,200,150,0.15)', label: 'WhatsApp Contact', sub: 'Direct communication' },
  { icon: '⚡', bg: 'rgba(245,158,11,0.15)', label: 'Fast & Reliable', sub: 'Quick responses' },
  { icon: '🔒', bg: 'rgba(37,99,235,0.15)', label: 'Safe & Secure', sub: 'Your safety first' },
]

const QUICK_LINKS = [
  { icon: '🛍️', label: 'Marketplace', to: '/marketplace', color: '#00C896' },
  { icon: '🧑‍💼', label: 'Services', to: '/services', color: '#2563EB' },
  { icon: '💼', label: 'Jobs', to: '/jobs', color: '#7C3AED' },
  { icon: '🎉', label: 'Events', to: '/events', color: '#F59E0B' },
  { icon: '🏠', label: 'Accommodation', to: '/accommodation', color: '#EF4444' },
]

export default function Hero() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [slide, setSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [trustIndex, setTrustIndex] = useState(0)
  const [trustAnimating, setTrustAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setSlide(prev => (prev + 1) % SLIDES.length)
        setAnimating(false)
      }, 300)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTrustAnimating(true)
      setTimeout(() => {
        setTrustIndex(prev => (prev + 1) % TRUST_ITEMS.length)
        setTrustAnimating(false)
      }, 350)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  const goSlide = (i) => {
    setAnimating(true)
    setTimeout(() => { setSlide(i); setAnimating(false) }, 300)
  }

  const handleSearch = () => {
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  const current = SLIDES[slide]
  const trustItem = TRUST_ITEMS[trustIndex]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-hero-wrap { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* ── QUICK ACCESS ICON ROW ── */
        .sk-quick-row {
          background: #08162F;
          padding: 6px 12px 8px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .sk-quick-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          padding: 3px 4px;
          border-radius: 8px;
          transition: background 0.18s;
          flex: 1;
          max-width: 60px;
        }
        .sk-quick-item:hover { background: rgba(255,255,255,0.07); }
        .sk-quick-circle {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
        }
        .sk-quick-item:hover .sk-quick-circle {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-2px);
        }
        .sk-quick-label {
          font-size: 8.5px;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          text-align: center;
          white-space: nowrap;
          letter-spacing: 0.2px;
        }

        /* ── CAROUSEL ── */
        .sk-carousel {
          position: relative;
          min-height: 340px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 60px 80px;
          text-align: left;
          overflow: hidden;
          background-size: cover !important;
          background-position: center !important;
        }
        .sk-carousel-content {
          transition: opacity 0.3s ease, transform 0.3s ease;
          max-width: 540px;
        }
        .sk-carousel-content.fade {
          opacity: 0;
          transform: translateY(8px);
        }
        .sk-slide-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 14px;
          border: 1px solid;
        }
        .sk-carousel h1 {
          color: white;
          font-size: clamp(24px, 4vw, 44px);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 12px;
          letter-spacing: -1px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
          white-space: pre-line;
        }
        .sk-carousel-sub {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          margin: 0 0 26px;
          line-height: 1.6;
        }
        .sk-carousel-cta {
          border: none;
          padding: 11px 26px;
          font-size: 13.5px;
          font-weight: 800;
          border-radius: 50px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: inherit;
          transition: all 0.2s ease;
          color: #08162F;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        }
        .sk-carousel-cta:hover { transform: translateY(-2px); filter: brightness(1.06); }
        .sk-slide-dots {
          position: absolute;
          bottom: 52px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(0,0,0,0.25);
          backdrop-filter: blur(6px);
          padding: 5px 10px;
          border-radius: 20px;
        }
        .sk-slide-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          padding: 0;
        }
        .sk-slide-dot.active {
          width: 20px;
          border-radius: 3px;
          background: white;
        }
        .sk-slide-counter {
          position: absolute;
          top: 16px;
          right: 20px;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(6px);
          color: rgba(255,255,255,0.85);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 10px;
          letter-spacing: 0.5px;
        }

        /* ── FLOATING SEARCH — overlaps carousel bottom ── */
        
        .sk-search-section {
            position: relative;
            z-index: 90;
            margin-top: -23px;
            padding: 0 16px;
            pointer-events: none;
            background: transparent;
         }

       .sk-search-inner {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          gap: 8px;
          align-items: center;
          pointer-events: all;
        }

        
        .sk-search-bar {
         flex: 1;
         display: flex;
         align-items: center;
         background: rgba(8, 22, 47, 0.82);
         border: 1.5px solid rgba(255,255,255,0.18);
         border-radius: 50px;
         height: 46px;
         padding: 0 18px;
         gap: 10px;
         transition: all 0.2s;
         backdrop-filter: blur(20px);
         -webkit-backdrop-filter: blur(20px);
        }
        .sk-search-bar:focus-within {
         border-color: #00C896;
         background: rgba(8, 22, 47, 0.95);
         box-shadow: 0 0 0 3px rgba(0,200,150,0.2);
        }
        
        .sk-search-icon {
          font-size: 15px;
          flex-shrink: 0;
          color: rgba(255,255,255,0.4);
        }
        .sk-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 13px;
          color: white;
          font-family: inherit;
          background: transparent;
          font-weight: 500;
        }
        .sk-search-input::placeholder { color: rgba(255,255,255,0.38); }
        .sk-search-submit {
          height: 46px;
          padding: 0 22px;
          background: linear-gradient(135deg, #00C896, #059669);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(0,200,150,0.45);
        }
        .sk-search-submit:hover { transform: translateY(-1px); filter: brightness(1.08); }
        .sk-post-quick {
          height: 46px;
          padding: 0 18px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #1e3a5f;
          border: none;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 4px 14px rgba(245,158,11,0.4);
        }
        .sk-post-quick:hover { transform: translateY(-1px); }

        /* ── TRUST STRIP — single sliding item ── */
        .sk-trust-strip {
         background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
         padding: 13px 20px;
         margin-top: 0;
         display: flex;
         align-items: center;
         justify-content: center;
         min-height: 60px;
         overflow: hidden;
        }
         
        .sk-trust-slide-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .sk-trust-slide-wrap.trust-out {
          opacity: 0;
          transform: translateX(-28px);
        }
        .sk-trust-slide-wrap.trust-in {
          opacity: 1;
          transform: translateX(0);
        }
        .sk-trust-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .sk-trust-label { font-size: 13px; font-weight: 700; color: white; }
        .sk-trust-sub { font-size: 11px; color: rgba(255,255,255,0.45); font-weight: 500; margin-top: 2px; }
        .sk-trust-dots { display: flex; gap: 5px; margin-left: 18px; }
        .sk-trust-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.25);
          cursor: pointer; border: none; padding: 0; transition: all 0.3s;
        }
        .sk-trust-dot.active { background: #00C896; width: 14px; border-radius: 3px; }

        /* ── CATEGORY SECTION ── */
        .sk-cat-section {
          background: white;
          padding: 18px 20px 22px;
          border-bottom: 1px solid #f1f5f9;
        }
        .sk-cat-section-inner { max-width: 1240px; margin: 0 auto; }
        .sk-cat-sec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .sk-cat-sec-title { font-size: 14.5px; font-weight: 800; color: #0f172a; }
        .sk-cat-sec-viewall {
          font-size: 12px; font-weight: 700; color: #00C896;
          text-decoration: none; cursor: pointer; background: none;
          border: none; font-family: inherit; transition: opacity 0.2s;
        }
        .sk-cat-sec-viewall:hover { opacity: 0.75; }
        .sk-cat-icons-row {
          display: flex; gap: 6px; justify-content: space-between;
          overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;
        }
        .sk-cat-icons-row::-webkit-scrollbar { display: none; }
        .sk-cat-icon-item {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          cursor: pointer; background: none; border: none; font-family: inherit;
          padding: 0; flex-shrink: 0; min-width: 58px; transition: transform 0.2s;
        }
        .sk-cat-icon-item:hover { transform: translateY(-3px); }
        .sk-cat-icon-circle {
          width: 50px; height: 50px; border-radius: 14px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1.5px solid #e2e8f0; display: flex; align-items: center;
          justify-content: center; font-size: 21px; transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .sk-cat-icon-item:hover .sk-cat-icon-circle {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border-color: #00C896; box-shadow: 0 4px 14px rgba(0,200,150,0.18);
        }
        .sk-cat-icon-label {
          font-size: 10px; font-weight: 700; color: #374151;
          text-align: center; white-space: nowrap;
        }

        /* ── MOBILE ── */
       @media (max-width: 768px) {
         .sk-carousel { padding: 32px 20px 80px; min-height: 280px; }
         .sk-post-quick { display: none; }
         .sk-search-inner { gap: 7px; }
         .sk-search-section { margin-top: -23px; padding: 0 12px; background: transparent; }
         .sk-slide-dots { bottom: 52px; }
        }
        @media (max-width: 420px) {
          .sk-quick-circle { width: 30px; height: 30px; font-size: 14px; }
          .sk-quick-label { font-size: 8px; }
        }
      `}</style>

      <div className="sk-hero-wrap">

        {/* Quick Access Icon Row */}
        <div className="sk-quick-row">
          {QUICK_LINKS.map(item => (
            <button key={item.label} className="sk-quick-item" onClick={() => navigate(item.to)}>
              <div className="sk-quick-circle" style={{ borderColor: `${item.color}44` }}>
                {item.icon}
              </div>
              <span className="sk-quick-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Hero Carousel */}
        <div className="sk-carousel" style={{ backgroundImage: current.bg }}>
          <div className="sk-slide-counter">{slide + 1} / {SLIDES.length}</div>
          <div className={`sk-carousel-content ${animating ? 'fade' : ''}`}>
            <div className="sk-slide-badge" style={{
              color: current.accent,
              borderColor: `${current.accent}44`,
              background: `${current.accent}18`,
            }}>
              {current.badge}
            </div>
            <h1>{current.title}</h1>
            <p className="sk-carousel-sub">{current.sub}</p>
            <button
              className="sk-carousel-cta"
              style={{ background: `linear-gradient(135deg, ${current.accent}, ${current.accent}bb)` }}
              onClick={() => navigate(current.to)}
            >
              {current.cta} →
            </button>
          </div>
          <div className="sk-slide-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`sk-slide-dot ${i === slide ? 'active' : ''}`}
                onClick={() => goSlide(i)}
              />
            ))}
          </div>
        </div>

        {/* Floating Search — overlaps bottom of carousel */}
        <div className="sk-search-section">
          <div className="sk-search-inner">
            <div className="sk-search-bar">
              <span className="sk-search-icon">🔍</span>
              <input
                className="sk-search-input"
                type="text"
                placeholder="Search items, services, jobs, events…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="sk-search-submit" onClick={handleSearch}>Search</button>
            <button className="sk-post-quick" onClick={() => navigate('/create')}>
              ➕ Sell
            </button>
          </div>
        </div>

        {/* Trust Strip — auto-sliding */}
        <div className="sk-trust-strip">
          <div className={`sk-trust-slide-wrap ${trustAnimating ? 'trust-out' : 'trust-in'}`}>
            <div className="sk-trust-icon-wrap" style={{ background: trustItem.bg }}>
              {trustItem.icon}
            </div>
            <div>
              <div className="sk-trust-label">{trustItem.label}</div>
              <div className="sk-trust-sub">{trustItem.sub}</div>
            </div>
          </div>
          <div className="sk-trust-dots">
            {TRUST_ITEMS.map((_, i) => (
              <button
                key={i}
                className={`sk-trust-dot ${i === trustIndex ? 'active' : ''}`}
                onClick={() => {
                  setTrustAnimating(true)
                  setTimeout(() => { setTrustIndex(i); setTrustAnimating(false) }, 350)
                }}
              />
            ))}
          </div>
        </div>

        {/* Shop by Category */}
        <div className="sk-cat-section">
          <div className="sk-cat-section-inner">
            <div className="sk-cat-sec-header">
              <span className="sk-cat-sec-title">🛍️ Shop by Category</span>
              <button className="sk-cat-sec-viewall" onClick={() => navigate('/marketplace')}>
                View All →
              </button>
            </div>
            <div className="sk-cat-icons-row">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  className="sk-cat-icon-item"
                  onClick={() => cat.to
                    ? navigate(cat.to)
                    : navigate('/marketplace?category=' + encodeURIComponent(cat.category))
                  }
                >
                  <div className="sk-cat-icon-circle">{cat.icon}</div>
                  <span className="sk-cat-icon-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}