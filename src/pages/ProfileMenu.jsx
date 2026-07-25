import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft, ChevronRight, ChevronDown, BadgeCheck, User, ShoppingBag, Heart,
  PlusCircle, Compass, Briefcase, PartyPopper, Home, Settings, LifeBuoy,
  HelpCircle, Store, ShieldCheck, MessageCircle, Bug, Scale, FileText, Lock,
  Building2, Cookie, ShieldAlert, LayoutDashboard, Users, Flag, BarChart3,
  History, LogOut, Wrench,
} from 'lucide-react'

// ---------- Menu config ----------
// Each group is an accordion row; its `items` render as flat sub-rows when open.
// Add `badge: 'New'` to any item to show a highlight pill, like the reference design.
function buildGroups(user) {
  return [
    {
      key: 'account',
      icon: Settings,
      color: '#00C896',
      bg: '#ecfdf5',
      title: 'Manage Account',
      sub: 'Profile, listings, saved items',
      items: [
        { icon: User, label: 'My Profile', to: user ? '/profile/' + user._id : '/login' },
        { icon: ShoppingBag, label: 'My Listings', to: '/my-listings' },
        { icon: Heart, label: 'Saved Items', to: '/saved' },
        { icon: PlusCircle, label: 'Post a Listing', to: '/create', badge: 'New' },
      ],
    },
    {
      key: 'explore',
      icon: Compass,
      color: '#2563EB',
      bg: '#eff6ff',
      title: 'Explore Platform',
      sub: 'Marketplace, jobs, events & more',
      items: [
        { icon: ShoppingBag, label: 'Marketplace', to: '/marketplace' },
        { icon: Wrench, label: 'Services', to: '/services' },
        { icon: Briefcase, label: 'Jobs', to: '/jobs' },
        { icon: PartyPopper, label: 'Events', to: '/events' },
        { icon: Home, label: 'Accommodation', to: '/accommodation' },
      ],
    },
    ...(user?.isAdmin ? [{
      key: 'admin',
      icon: ShieldAlert,
      color: '#7C3AED',
      bg: '#f5f3ff',
      title: 'Administration',
      sub: 'Manage the platform',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
        { icon: Users, label: 'Manage Users', to: '/admin/users' },
        { icon: ShoppingBag, label: 'Manage Listings', to: '/admin/listings' },
        { icon: Flag, label: 'Reports', to: '/admin/reports' },
        { icon: BarChart3, label: 'Analytics', to: '/admin/analytics' },
        { icon: History, label: 'Activity Feed', to: '/admin/activity' },
      ],
    }] : []),
    {
      key: 'help',
      icon: LifeBuoy,
      color: '#d97706',
      bg: '#fffbeb',
      title: 'Help Centre',
      sub: 'Guides, safety tips, support',
      items: [
        { icon: HelpCircle, label: 'How to Buy', to: '/help/how-to-buy' },
        { icon: Store, label: 'How to Sell', to: '/help/how-to-sell' },
        { icon: ShieldCheck, label: 'Staying Safe', to: '/help/safety' },
        { icon: MessageCircle, label: 'Contact Support', to: '/help/contact' },
        { icon: Bug, label: 'Report a Bug', to: '/help/bug' },
      ],
    },
    {
      key: 'legal',
      icon: Scale,
      color: '#6b7280',
      bg: '#f3f4f6',
      title: 'Legal & Policies',
      sub: 'Terms, privacy, about us',
      items: [
        { icon: FileText, label: 'Terms of Use', to: '/legal/terms' },
        { icon: Lock, label: 'Privacy Policy', to: '/legal/privacy' },
        { icon: ShieldCheck, label: 'Privacy Centre', to: '/legal/privacy-centre' },
        { icon: Building2, label: 'About Us', to: '/about' },
        { icon: Cookie, label: 'Cookie Policy', to: '/legal/cookies' },
        { icon: Scale, label: 'Community Guidelines', to: '/legal/guidelines' },
      ],
    },
  ]
}

const GUEST_EXPLORE = [
  { icon: ShoppingBag, label: 'Marketplace', to: '/marketplace' },
  { icon: Wrench, label: 'Services', to: '/services' },
  { icon: Briefcase, label: 'Jobs', to: '/jobs' },
  { icon: PartyPopper, label: 'Events', to: '/events' },
  { icon: Home, label: 'Accommodation', to: '/accommodation' },
]

function memberSince(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
}

// Measures its real content height so open/close animates smoothly instead of
// snapping — this is what makes the dropdown feel like part of the same
// screen (no route change, nothing "exits" the page) rather than a jump-cut.
function AccordionBody({ open, children }) {
  const ref = useRef(null)
  const [maxHeight, setMaxHeight] = useState(0)

  useEffect(function () {
    if (open && ref.current) {
      setMaxHeight(ref.current.scrollHeight)
    } else {
      setMaxHeight(0)
    }
  }, [open, children])

  return (
    <div className={'pm-accordion-body' + (open ? ' pm-accordion-open' : '')} style={{ maxHeight }}>
      <div ref={ref}>{children}</div>
    </div>
  )
}

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [openSection, setOpenSection] = useState(null)

  function handleLogout() {
    if (!window.confirm('Log out of your account?')) return
    logout()
    navigate('/')
  }

  function toggleSection(key) {
    setOpenSection(function (prev) { return prev === key ? null : key })
  }

  const groups = buildGroups(user)
  const since = memberSince(user?.createdAt)

  return (
    <div className="pm-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .pm-page { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: #f5f6f9; }
        .pm-wrap { max-width: 560px; margin: 0 auto; min-height: 100vh; background: #f5f6f9; }

        /* ---------- Header ---------- */
        .pm-header {
          background: linear-gradient(160deg, #08162F 0%, #10275e 100%);
          padding: 44px 18px 22px; position: relative; border-radius: 0 0 22px 22px;
        }
        .pm-back {
          position: absolute; top: 14px; left: 14px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.85); width: 34px; height: 34px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .pm-back:hover { background: rgba(255,255,255,0.18); }

        .pm-identity { display: flex; flex-direction: column; align-items: center; }
        .pm-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, #00C896, #059669);
          display: flex; align-items: center; justify-content: center;
          font-size: 27px; font-weight: 800; color: white;
          border: 3px solid rgba(255,255,255,0.18); margin-bottom: 12px;
          box-shadow: 0 8px 22px rgba(0,200,150,0.3);
        }
        .pm-avatar-guest {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.14);
          display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
        }
        .pm-name { font-size: 18px; font-weight: 800; color: white; margin: 0 0 2px; text-align: center; }
        .pm-email { font-size: 11.5px; color: rgba(255,255,255,0.45); text-align: center; font-weight: 500; margin: 0 0 12px; }
        .pm-guest-label { font-size: 16px; color: rgba(255,255,255,0.85); font-weight: 700; text-align: center; margin: 0 0 4px; }

        .pm-verified-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(0,200,150,0.15); border: 1px solid rgba(0,200,150,0.3);
          color: #34d399; padding: 4px 11px; border-radius: 20px;
          font-size: 10.5px; font-weight: 700; margin-bottom: 14px;
        }

        .pm-stats { display: flex; gap: 1px; border-radius: 12px; overflow: hidden; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); width: 100%; max-width: 400px; }
        .pm-stat { flex: 1; padding: 10px 6px; text-align: center; }
        .pm-stat + .pm-stat { border-left: 1px solid rgba(255,255,255,0.07); }
        .pm-stat-num { font-size: 13px; font-weight: 800; color: #34d399; }
        .pm-stat-label { font-size: 9px; color: rgba(255,255,255,0.4); font-weight: 700; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.3px; }

        /* ---------- Content ---------- */
        .pm-content { padding: 14px 12px 90px; }
        .pm-section-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
          color: #9ca3af; margin: 16px 8px 6px;
        }
        .pm-section-label:first-child { margin-top: 2px; }

        .pm-card { background: white; border-radius: 14px; border: 1px solid #eef0f4; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.03); }
        .pm-card + .pm-card { margin-top: 10px; }

        /* Row shared by group headers, sub-items, and direct links */
        .pm-row {
          display: flex; align-items: center; gap: 12px; width: 100%;
          padding: 13px 14px; border: none; background: none; cursor: pointer;
          font-family: inherit; text-align: left; text-decoration: none;
          border-bottom: 1px solid #f4f5f8;
        }
        .pm-row:last-child { border-bottom: none; }
        .pm-row:hover { background: #fafbfc; }
        .pm-row-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pm-row-text { flex: 1; min-width: 0; }
        .pm-row-title { font-size: 13.5px; font-weight: 700; color: #111827; line-height: 1.3; }
        .pm-row-sub { font-size: 11px; color: #9ca3af; font-weight: 500; margin-top: 1px; }
        .pm-row-badge { font-size: 9.5px; font-weight: 800; color: white; background: #ef4444; padding: 2px 8px; border-radius: 20px; flex-shrink: 0; }
        .pm-row-chevron { color: #cbd0da; flex-shrink: 0; transition: transform 0.2s; }
        .pm-row-chevron.open { transform: rotate(180deg); }

        /* ---------- Accordion body: measured-height animation ---------- */
        .pm-accordion-body { overflow: hidden; transition: max-height 0.28s cubic-bezier(0.4,0,0.2,1); }
        .pm-accordion-open { }

        /* Sub-items: indented, tinted to match the parent group, connector line */
        .pm-subrow-wrap { position: relative; padding-left: 20px; }
        .pm-subrow-wrap::before {
          content: ''; position: absolute; left: 30px; top: 0; bottom: 0; width: 1px;
          background: var(--connector, rgba(0,0,0,0.06));
        }
        .pm-subrow {
          position: relative; padding-left: 10px; padding-right: 14px;
          border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .pm-subrow:hover { filter: brightness(0.98); }
        .pm-subrow .pm-row-icon { width: 28px; height: 28px; border-radius: 8px; }
        .pm-subrow .pm-row-title { font-size: 12.5px; font-weight: 600; color: #374151; }

        .pm-row.danger .pm-row-title { color: #dc2626; }
        .pm-row.danger:hover { background: #fef2f2; }
        .pm-row.admin .pm-row-title { color: #6d28d9; }

        .pm-card.pm-open { box-shadow: 0 4px 16px rgba(8,22,47,0.08); }
        .pm-card .pm-row[aria-expanded="true"] { background: #fafbfc; }

        /* ---------- Guest auth buttons ---------- */
        .pm-auth { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
        .pm-auth-btn {
          display: block; padding: 14px 16px; border-radius: 13px; font-weight: 700;
          font-size: 14px; text-align: center; text-decoration: none;
          font-family: inherit; cursor: pointer; border: none; transition: opacity 0.2s;
        }
        .pm-auth-btn:hover { opacity: 0.9; }

        .pm-version { text-align: center; font-size: 11px; color: #c4c9d4; font-weight: 600; margin-top: 22px; }
        .pm-version span { color: #00C896; }

        /* ---------- Desktop ---------- */
        @media (min-width: 769px) {
          .pm-wrap { border-left: 1px solid #eef0f4; border-right: 1px solid #eef0f4; box-shadow: 0 0 40px rgba(0,0,0,0.04); }
          .pm-content { padding: 16px 20px 70px; }
        }
      `}</style>

      <div className="pm-wrap">

        {/* Header */}
        <div className="pm-header">
          <button className="pm-back" onClick={function () { navigate(-1) }} aria-label="Go back"><ArrowLeft size={16} /></button>
          <div className="pm-identity">
            {user ? (
              <>
                <div className="pm-avatar">{(user.name || '?').charAt(0).toUpperCase()}</div>
                <p className="pm-name">{user.name}</p>
                <p className="pm-email">{user.email}</p>
                <div className="pm-verified-badge"><BadgeCheck size={12} /> Campus Member</div>
                <div className="pm-stats">
                  <div className="pm-stat">
                    <div className="pm-stat-num">{user.listingsCount ?? '—'}</div>
                    <div className="pm-stat-label">Listings</div>
                  </div>
                  <div className="pm-stat">
                    <div className="pm-stat-num">{user.location?.city || 'Campus'}</div>
                    <div className="pm-stat-label">Location</div>
                  </div>
                  <div className="pm-stat">
                    <div className="pm-stat-num">{user.rating ? user.rating.toFixed(1) : '—'}</div>
                    <div className="pm-stat-label">Rating</div>
                  </div>
                  <div className="pm-stat">
                    <div className="pm-stat-num">{since || '—'}</div>
                    <div className="pm-stat-label">Member Since</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="pm-avatar-guest"><User size={28} color="rgba(255,255,255,0.6)" /></div>
                <p className="pm-guest-label">Welcome, Guest</p>
                <p className="pm-email">Sign in to access your account</p>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pm-content">
          {user ? (
            <>
              {groups.map(function (group) {
                const GroupIcon = group.icon
                const isOpen = openSection === group.key
                return (
                  <div className={'pm-card' + (isOpen ? ' pm-open' : '')} key={group.key}>
                    <button
                      className={'pm-row' + (group.key === 'admin' ? ' admin' : '')}
                      onClick={function () { toggleSection(group.key) }}
                      aria-expanded={isOpen}
                    >
                      <div className="pm-row-icon" style={{ background: group.bg }}>
                        <GroupIcon size={16} color={group.color} strokeWidth={2.25} />
                      </div>
                      <div className="pm-row-text">
                        <div className="pm-row-title" style={group.key === 'admin' ? { color: '#6d28d9' } : undefined}>{group.title}</div>
                        <div className="pm-row-sub">{group.sub}</div>
                      </div>
                      <ChevronDown size={16} className={'pm-row-chevron' + (isOpen ? ' open' : '')} />
                    </button>

                    <AccordionBody open={isOpen}>
                      <div className="pm-subrow-wrap" style={{ '--connector': hexToRgba(group.color, 0.18) }}>
                        {group.items.map(function (item) {
                          const ItemIcon = item.icon
                          return (
                            <Link
                              key={item.label}
                              to={item.to}
                              className="pm-row pm-subrow"
                              style={{ background: hexToRgba(group.color, 0.035) }}
                            >
                              <div className="pm-row-icon" style={{ background: hexToRgba(group.color, 0.14) }}>
                                <ItemIcon size={13} color={group.color} strokeWidth={2.25} />
                              </div>
                              <div className="pm-row-text">
                                <div className="pm-row-title">{item.label}</div>
                              </div>
                              {item.badge && <span className="pm-row-badge">{item.badge}</span>}
                              <ChevronRight size={13} color="#cbd0da" />
                            </Link>
                          )
                        })}
                      </div>
                    </AccordionBody>
                  </div>
                )
              })}

              <div className="pm-card" style={{ marginTop: 10 }}>
                <button className="pm-row danger" onClick={handleLogout}>
                  <div className="pm-row-icon" style={{ background: '#fef2f2' }}>
                    <LogOut size={16} color="#ef4444" strokeWidth={2.25} />
                  </div>
                  <div className="pm-row-text">
                    <div className="pm-row-title">Logout</div>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="pm-card">
                <div className="pm-row" style={{ cursor: 'default' }}>
                  <div className="pm-row-icon" style={{ background: '#eff6ff' }}>
                    <Compass size={16} color="#2563EB" strokeWidth={2.25} />
                  </div>
                  <div className="pm-row-text">
                    <div className="pm-row-title">Explore Platform</div>
                    <div className="pm-row-sub">Browse without an account</div>
                  </div>
                </div>
                {GUEST_EXPLORE.map(function (item) {
                  const ItemIcon = item.icon
                  return (
                    <Link key={item.label} to={item.to} className="pm-row pm-subrow">
                      <div className="pm-row-icon" style={{ background: '#eff6ff' }}>
                        <ItemIcon size={14} color="#2563EB" strokeWidth={2.25} />
                      </div>
                      <div className="pm-row-text"><div className="pm-row-title">{item.label}</div></div>
                      <ChevronRight size={14} color="#cbd0da" />
                    </Link>
                  )
                })}
              </div>

              <div className="pm-auth">
                <Link to="/login" className="pm-auth-btn" style={{ background: 'white', color: '#08162F', border: '1px solid #e5e7eb' }}>
                  Login to Your Account
                </Link>
                <Link to="/register" className="pm-auth-btn" style={{ background: 'linear-gradient(135deg,#00C896,#059669)', color: 'white' }}>
                  Register Free — Join the Community
                </Link>
              </div>
            </>
          )}

          <p className="pm-version">Scalable<span>nexus</span> v1.0 · Built for Campus Zimbabwe</p>
        </div>
      </div>
    </div>
  )
}