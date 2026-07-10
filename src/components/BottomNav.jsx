import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function BottomNav() {
  const location = useLocation()
  const { user } = useAuth()
  const path = location.pathname

  const items = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/marketplace', icon: '🛍️', label: 'Categories' },
    { to: '/create', icon: null, label: 'Sell', isSell: true },
    { to: '/saved', icon: '❤️', label: 'Saved' },
    { to: '/profile-menu', icon: '👤', label: 'Profile' },
  ]

  return (
    <>
      <style>{`
        .sk-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background: white;
          border-top: 1px solid #f1f5f9;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
          height: 62px;
          align-items: center;
          justify-content: space-around;
          padding: 0 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sk-bn-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 12px;
          transition: all 0.2s;
          min-width: 52px;
          position: relative;
        }
        .sk-bn-icon { font-size: 20px; line-height: 1; }
        .sk-bn-label { font-size: 10px; font-weight: 600; color: #9ca3af; transition: color 0.2s; }
        .sk-bn-item.active .sk-bn-label { color: #00C896; }
        .sk-bn-active-dot {
          position: absolute; top: 2px; width: 4px; height: 4px;
          border-radius: 50%; background: #00C896;
        }
        .sk-bn-sell {
          width: 48px; height: 48px; border-radius: 16px;
          background: linear-gradient(135deg, #00C896, #059669);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(0,200,150,0.4);
          text-decoration: none; transition: all 0.2s; margin-bottom: 8px;
        }
        .sk-bn-sell:hover { transform: scale(1.08); }
        .sk-bn-sell-icon { font-size: 22px; }
        @media (max-width: 768px) { .sk-bottom-nav { display: flex !important; } }
      `}</style>

      <nav className="sk-bottom-nav">
        {items.map(item => (
          item.isSell ? (
            <Link key="sell" to={item.to} className="sk-bn-sell">
              <span className="sk-bn-sell-icon">➕</span>
            </Link>
          ) : (
            <Link
              key={item.to}
              to={item.to}
              className={`sk-bn-item ${path === item.to || (item.to === '/profile-menu' && path === '/profile-menu') ? 'active' : ''}`}
            >
              {(path === item.to) && <div className="sk-bn-active-dot" />}
              <span className="sk-bn-icon">{item.icon}</span>
              <span className="sk-bn-label">{item.label}</span>
            </Link>
          )
        ))}
      </nav>
    </>
  )
}