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
  { icon: '👗', label: 'Fashion', to: '/marketplace?category=Fashion' },
  { icon: '📱', label: 'Electronics', to: '/marketplace?category=Electronics' },
  { icon: '💄', label: 'Cosmetics', to: '/marketplace?category=Cosmetics & Hair' },
  { icon: '🚗', label: 'Vehicles', to: '/marketplace?category=Vehicles' },
  { icon: '🛋️', label: 'Furniture', to: '/marketplace?category=Furniture' },
  { icon: '🍔', label: 'Food', to: '/marketplace?category=Food' },
  { icon: '🧑‍💼', label: 'Services', to: '/services' },
  { icon: '💼', label: 'Jobs', to: '/jobs' },
  { icon: '📦', label: 'Other', to: '/marketplace?category=Other' },
]

export default function Hero() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [slide, setSlide] = useState(0)

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(prev => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = () => {
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  const current = SLIDES[slide]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-hero-wrap { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* Carousel */
        .sk-carousel {
          position: relative;
          min-height: 360px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 60px;
          text-align: left;
          overflow: hidden;
          transition: background 0.6s ease;
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
          opacity: 0.9;
        }
        .sk-carousel h1 {
          color: white;
          font-size: clamp(26px, 4vw, 46px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 12px;
          letter-spacing: -1px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
          white-space: pre-line;
          max-width: 520px;
        }
        .sk-carousel-sub {
          color: rgba(255,255,255,0.72);
          font-size: 14px;
          margin-bottom: 28px;
          max-width: 440px;
          line-height: 1.6;
        }
        .sk-carousel-cta {
          border: none;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 800;
          border-radius: 50px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          transition: all 0.2s ease;
          color: #08162F;
        }
        .sk-carousel-cta:hover { transform: translateY(-2px); filter: brightness(1.05); }

        /* Slide indicators */
        .sk-slide-dots {
          position: absolute;
          bottom: 20px;
          left: 60px;
          display: flex;
          gap: 6px;
        }
        .sk-slide-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          padding: 0;
        }
        .sk-slide-dot.active {
          width: 22px;
          border-radius: 3px;
          background: white;
        }

        /* Slide counter */
        .sk-slide-counter {
          position: absolute;
          top: 20px;
          left: 60px;
          background: rgba(255,255,255,0.15);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 10px;
          backdrop-filter: blur(4px);
        }

        /* Search Section */
        .sk-search-section {
          background: white;
          padding: 16px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          position: sticky;
          top: 60px;
          z-index: 90;
        }
        .sk-search-inner {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .sk-search-bar {
          flex: 1;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          height: 44px;
          padding: 0 14px;
          gap: 8px;
          transition: border 0.2s;
        }
        .sk-search-bar:focus-within {
          border-color: #00C896;
          background: white;
          box-shadow: 0 0 0 3px rgba(0,200,150,0.1);
        }
        .sk-search-icon { font-size: 16px; flex-shrink: 0; }
        .sk-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 13.5px;
          color: #1f2937;
          font-family: inherit;
          background: transparent;
        }
        .sk-search-input::placeholder { color: #9ca3af; }
        .sk-search-submit {
          height: 44px;
          padding: 0 22px;
          background: linear-gradient(135deg, #08162F, #1e3a8a);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .sk-search-submit:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .sk-post-quick {
          height: 44px;
          padding: 0 18px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #1e3a5f;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sk-post-quick:hover { transform: translateY(-1px); }

        /* Trust Strip */
        .sk-trust-strip {
          background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
          display: flex;
          align-items: stretch;
          justify-content: center;
          flex-wrap: wrap;
        }
        .sk-trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border-right: 1px solid rgba(255,255,255,0.07);
          flex: 1;
          min-width: 150px;
          max-width: 260px;
        }
        .sk-trust-item:last-child { border-right: none; }
        .sk-trust-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }
        .sk-trust-label { font-size: 12.5px; font-weight: 700; color: white; }
        .sk-trust-sub { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 1px; }

        /* Category Section */
        .sk-cat-section {
          background: white;
          padding: 20px 20px 24px;
          border-bottom: 1px solid #f1f5f9;
        }
        .sk-cat-section-inner { max-width: 1240px; margin: 0 auto; }
        .sk-cat-sec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .sk-cat-sec-title { font-size: 15px; font-weight: 800; color: #0f172a; }
        .sk-cat-sec-viewall {
          font-size: 12px;
          font-weight: 700;
          color: #00C896;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
        }
        .sk-cat-icons-row {
          display: flex;
          gap: 8px;
          justify-content: space-between;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .sk-cat-icons-row::-webkit-scrollbar { display: none; }
        .sk-cat-icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          padding: 0;
          flex-shrink: 0;
          min-width: 60px;
          transition: transform 0.2s;
        }
        .sk-cat-icon-item:hover { transform: translateY(-3px); }
        .sk-cat-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .sk-cat-icon-item:hover .sk-cat-icon-circle {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border-color: #00C896;
          box-shadow: 0 4px 16px rgba(0,200,150,0.2);
        }
        .sk-cat-icon-label {
          font-size: 10.5px;
          font-weight: 700;
          color: #374151;
          text-align: center;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .sk-carousel { padding: 36px 20px 48px; min-height: 300px; }
          .sk-slide-dots { left: 20px; }
          .sk-slide-counter { left: 20px; }
          .sk-trust-item { padding: 10px 14px; min-width: 120px; }
          .sk-trust-sub { display: none; }
          .sk-search-inner { gap: 8px; }
          .sk-post-quick { display: none; }
        }
      `}</style>

      <div className="sk-hero-wrap">

        {/* Hero Carousel */}
        <div className="sk-carousel" style={{ backgroundImage: current.bg, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="sk-slide-counter">{slide + 1} / {SLIDES.length}</div>

          <div className="sk-slide-badge" style={{ color: current.accent, borderColor: `${current.accent}44`, background: `${current.accent}18` }}>
            {current.badge}
          </div>

          <h1>{current.title}</h1>
          <p className="sk-carousel-sub">{current.sub}</p>

          <button
            className="sk-carousel-cta"
            style={{ background: `linear-gradient(135deg, ${current.accent}, ${current.accent}cc)` }}
            onClick={() => navigate(current.to)}
          >
            {current.cta} →
          </button>

          <div className="sk-slide-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`sk-slide-dot ${i === slide ? 'active' : ''}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>

        {/* Sticky Search */}
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

        {/* Trust Strip */}
        <div className="sk-trust-strip">
          {[
            { icon: '🛡️', bg: 'rgba(0,200,150,0.15)', label: 'Verified Sellers', sub: 'Trusted community' },
            { icon: '💬', bg: 'rgba(0,200,150,0.15)', label: 'WhatsApp Contact', sub: 'Direct communication' },
            { icon: '⚡', bg: 'rgba(245,158,11,0.15)', label: 'Fast & Reliable', sub: 'Quick responses' },
            { icon: '🔒', bg: 'rgba(37,99,235,0.15)', label: 'Safe & Secure', sub: 'Your safety first' },
          ].map(item => (
            <div key={item.label} className="sk-trust-item">
              <div className="sk-trust-icon-wrap" style={{ background: item.bg }}>{item.icon}</div>
              <div>
                <div className="sk-trust-label">{item.label}</div>
                <div className="sk-trust-sub">{item.sub}</div>
              </div>
            </div>
          ))}
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
                <button key={cat.label} className="sk-cat-icon-item" onClick={() => navigate(cat.to)}>
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