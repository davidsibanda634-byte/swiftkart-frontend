import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, ShoppingBag, Flag, Briefcase, CalendarDays,
  UserCog, LayoutGrid, Megaphone, BarChart3, Settings, ShieldCheck,
  FileText, LogOut, Menu, X, ChevronRight,
} from 'lucide-react'

// ---------- Sidebar navigation config ----------
// Every route is listed even if the page isn't built yet — just wire up
// the matching <Route> later and these links will work automatically.
const NAV_MAIN = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Listings', to: '/admin/listings', icon: ShoppingBag },
  { label: 'Reports', to: '/admin/reports', icon: Flag },
  { label: 'Jobs', to: '/admin/jobs', icon: Briefcase },
  { label: 'Events', to: '/admin/events', icon: CalendarDays },
  { label: 'Services', to: '/admin/services', icon: UserCog },
  { label: 'Categories', to: '/admin/categories', icon: LayoutGrid },
  { label: 'Advertisements', to: '/admin/advertisements', icon: Megaphone },
]

const NAV_SYSTEM = [
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
  { label: 'Verification', to: '/admin/verification', icon: ShieldCheck },
  { label: 'System Logs', to: '/admin/logs', icon: FileText },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close the mobile drawer automatically if the viewport grows into desktop
  useEffect(function () {
    function handleResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return function () { window.removeEventListener('resize', handleResize) }
  }, [])

  function handleLogout() {
    if (typeof logout === 'function') logout()
    navigate('/login')
  }

  function NavList({ items }) {
    return (
      <nav className="adl-nav">
        {items.map(function (item) {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={function () { setMobileOpen(false) }}
              className={function ({ isActive }) { return 'adl-nav-item' + (isActive ? ' adl-nav-active' : '') }}
            >
              <Icon size={17} strokeWidth={2} className="adl-nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    )
  }

  return (
    <div className="adl-shell">
      <style>{`
        * { box-sizing: border-box; }
        .adl-shell { min-height: 100vh; background: #f5f6f9; font-family: 'Plus Jakarta Sans', sans-serif; }

        /* ---------- Mobile top bar (mobile-first default) ---------- */
        .adl-mobile-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; background: #08162F; position: sticky; top: 0; z-index: 30;
        }
        .adl-menu-btn, .adl-close-btn {
          background: transparent; border: none; color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
        }
        .adl-menu-btn:hover, .adl-close-btn:hover { background: rgba(255,255,255,0.08); }
        .adl-mobile-brand { color: white; font-weight: 800; font-size: 14.5px; letter-spacing: -0.2px; }
        .adl-mobile-brand span { color: #00C896; }

        .adl-backdrop {
          position: fixed; inset: 0; background: rgba(8,22,47,0.55);
          z-index: 40; backdrop-filter: blur(1px);
        }

        /* ---------- Sidebar (mobile-first: off-canvas drawer) ---------- */
        .adl-sidebar {
          position: fixed; top: 0; left: 0; height: 100vh; width: 250px;
          background: #08162F; z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
          display: flex; flex-direction: column;
          padding: 16px 12px;
          overflow-y: auto;
        }
        .adl-sidebar-open { transform: translateX(0); }

        .adl-sidebar-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding: 0 4px; }
        .adl-brand { display: flex; align-items: center; gap: 8px; }
        .adl-brand-mark {
          width: 26px; height: 26px; border-radius: 7px; background: #00C896;
          color: #08162F; font-weight: 800; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .adl-brand-name { color: white; font-weight: 800; font-size: 14.5px; letter-spacing: -0.2px; }
        .adl-brand-accent { color: #00C896; }

        .adl-section-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.32); margin: 14px 8px 6px;
        }
        .adl-section-label:first-of-type { margin-top: 4px; }

        .adl-nav { display: flex; flex-direction: column; gap: 2px; }
        .adl-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 9px;
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.62); text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .adl-nav-icon { flex-shrink: 0; opacity: 0.85; }
        .adl-nav-item:hover { background: rgba(255,255,255,0.06); color: white; }
        .adl-nav-active {
          background: #00C896; color: #062018; font-weight: 700;
          box-shadow: 0 4px 12px rgba(0,200,150,0.28);
        }
        .adl-nav-active .adl-nav-icon { opacity: 1; }
        .adl-nav-active:hover { background: #00C896; color: #062018; }

        .adl-sidebar-bottom { margin-top: auto; padding-top: 14px; display: flex; flex-direction: column; gap: 8px; }
        .adl-profile-card {
          display: flex; align-items: center; gap: 9px; width: 100%;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 11px; padding: 9px 10px; cursor: pointer;
        }
        .adl-profile-card:hover { background: rgba(255,255,255,0.08); }
        .adl-profile-avatar {
          width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg,#00C896,#059669);
          color: white; font-weight: 800; font-size: 12.5px;
          display: flex; align-items: center; justify-content: center;
        }
        .adl-profile-info { flex: 1; min-width: 0; text-align: left; display: flex; flex-direction: column; }
        .adl-profile-name { color: white; font-size: 12.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .adl-profile-role { color: rgba(255,255,255,0.4); font-size: 10.5px; font-weight: 600; }
        .adl-profile-card svg { color: rgba(255,255,255,0.4); flex-shrink: 0; }

        .adl-logout {
          display: flex; align-items: center; gap: 9px; width: 100%;
          background: transparent; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px; padding: 9px 12px; cursor: pointer;
          color: rgba(255,255,255,0.6); font-size: 12.5px; font-weight: 700; font-family: inherit;
        }
        .adl-logout:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.25); color: #fca5a5; }

        /* ---------- Main content ---------- */
        .adl-main { padding: 16px; max-width: 1600px; }

        /* ---------- Desktop (min-width breakpoint = mobile-first) ---------- */
        @media (min-width: 1024px) {
          .adl-mobile-bar { display: none; }
          .adl-backdrop { display: none; }
          .adl-sidebar { transform: translateX(0); box-shadow: 2px 0 12px rgba(0,0,0,0.06); }
          .adl-main { margin-left: 250px; padding: 26px 30px; }
        }
        @media (min-width: 1440px) {
          .adl-main { padding: 30px 40px; }
        }
      `}</style>

      {/* Mobile top bar */}
      <div className="adl-mobile-bar">
        <button className="adl-menu-btn" onClick={function () { setMobileOpen(true) }} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <span className="adl-mobile-brand">Scalable<span>nexus</span></span>
        <div style={{ width: 34 }} />
      </div>

      {mobileOpen && <div className="adl-backdrop" onClick={function () { setMobileOpen(false) }} />}

      <aside className={'adl-sidebar' + (mobileOpen ? ' adl-sidebar-open' : '')}>
        <div className="adl-sidebar-top">
          <div className="adl-brand">
            <span className="adl-brand-mark">S</span>
            <span className="adl-brand-name">Scalable<span className="adl-brand-accent">nexus</span></span>
          </div>
          <button className="adl-close-btn" onClick={function () { setMobileOpen(false) }} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <p className="adl-section-label">Admin Panel</p>
        <NavList items={NAV_MAIN} />

        <p className="adl-section-label">System</p>
        <NavList items={NAV_SYSTEM} />

        <div className="adl-sidebar-bottom">
          <button className="adl-profile-card" onClick={function () { navigate('/admin/settings') }}>
            <span className="adl-profile-avatar">{(user?.name || 'A').charAt(0).toUpperCase()}</span>
            <span className="adl-profile-info">
              <span className="adl-profile-name">{user?.name || 'Admin'}</span>
              <span className="adl-profile-role">Super Administrator</span>
            </span>
            <ChevronRight size={15} />
          </button>
          <button className="adl-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="adl-main">
        {children}
      </main>
    </div>
  )
}