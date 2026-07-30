import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { ShoppingCart, User } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-navbar {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #08162F;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .sk-navbar-inner {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          max-width: 1400px;
          margin: 0 auto;
          gap: 16px;
        }
        .sk-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .sk-logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #00C896, #059669);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .sk-logo-text {
          font-size: 18px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }
        .sk-logo-text span { color: #00C896; }

        .sk-nav-center {
          display: flex;
          align-items: center;
          gap: 2px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          max-width: 52vw;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .sk-nav-center::-webkit-scrollbar { display: none; }
        .sk-nav-link {
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 7px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .sk-nav-link:hover { color: white; background: rgba(255,255,255,0.1); }

        .sk-nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .sk-btn-outline {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.22);
          padding: 7px 15px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.2s;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
        }
        .sk-btn-outline:hover { background: rgba(255,255,255,0.18); }

        .sk-btn-green {
          background: linear-gradient(135deg, #00C896, #059669);
          color: white;
          border: none;
          padding: 7px 15px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.2s;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 3px 10px rgba(0,200,150,0.3);
        }
        .sk-btn-green:hover { transform: translateY(-1px); }

        /* ── Desktop profile avatar — clicks to /profile-menu ── */
        .sk-profile-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00C896, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          color: white;
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.2);
          transition: all 0.2s;
          flex-shrink: 0;
          text-decoration: none;
        }
        .sk-profile-avatar:hover { border-color: #00C896; transform: scale(1.05); }

        /* ── Mobile profile button ── */
        .sk-mobile-profile-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00C896, #059669);
          border: 2px solid rgba(255,255,255,0.25);
          color: white;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          flex-shrink: 0;
          font-family: inherit;
          transition: all 0.2s;
        }
        .sk-mobile-profile-btn:hover { border-color: #00C896; transform: scale(1.05); }

        @media (min-width: 769px) {
          .sk-mobile-profile-btn { display: none !important; }
          .sk-nav-center { display: flex !important; }
          .sk-nav-right { display: flex !important; }
        }
        @media (max-width: 768px) {
          .sk-nav-center { display: none !important; }
          .sk-nav-right { display: none !important; }
          .sk-mobile-profile-btn { display: flex !important; }
          .sk-navbar-inner { padding: 0 16px; }
        }
      `}</style>

      <nav className="sk-navbar">
        <div className="sk-navbar-inner">
          <Link to="/" className="sk-logo">
            <div className="sk-logo-icon"><ShoppingCart size={17} color="white" strokeWidth={2.25} /></div>
            <span className="sk-logo-text">Scalable<span>nexus</span></span>
          </Link>

          <div className="sk-nav-center">
            {[
              { label: 'Marketplace', to: '/marketplace' },
              { label: 'Services', to: '/services' },
              { label: 'Jobs', to: '/jobs' },
              { label: 'Events', to: '/events' },
              { label: 'Accommodation', to: '/accommodation' },
            ].map(item => (
              <Link key={item.label} to={item.to} className="sk-nav-link">{item.label}</Link>
            ))}
          </div>

          <div className="sk-nav-right">
            {user ? (
              <>
                <Link to="/create" className="sk-btn-green">+ Post Listing</Link>
                {/* Desktop profile avatar — goes to full profile menu page */}
                <Link to="/profile-menu" className="sk-profile-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="sk-btn-outline">Login</Link>
                <Link to="/register" className="sk-btn-green">Register</Link>
              </>
            )}
          </div>

          {/* Mobile profile button — also goes to /profile-menu */}
          <button
            className="sk-mobile-profile-btn"
            onClick={() => navigate('/profile-menu')}
            aria-label="Profile menu"
          >
            {user ? user.name?.charAt(0).toUpperCase() : <User size={17} />}
          </button>
        </div>
      </nav>
    </>
  )
}