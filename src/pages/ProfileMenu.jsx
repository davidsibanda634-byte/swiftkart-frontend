import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft, BadgeCheck, User, ShoppingBag, Heart, PlusCircle,
  Briefcase, PartyPopper, Home, HelpCircle, Store, ShieldCheck,
  MessageCircle, Bug, Scale, FileText, Lock, Building2, Cookie, ShieldAlert,
  LayoutDashboard, Users, Flag, BarChart3, History, LogOut, Wrench, Ticket,
  BarChart2, TrendingUp, Zap, Star, Package, CreditCard, Bell, MapPin,
  Trash2, ChevronRight,
} from 'lucide-react'

function memberSince(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
      textTransform: 'uppercase', color: '#6b7280', margin: '20px 4px 8px',
    }}>
      {children}
    </p>
  )
}

function Row({ icon: Icon, iconColor = '#00C896', iconBg = '#ecfdf5', label, sub, to, onClick, badge, danger, comingSoon }) {
  const style = {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '13px 16px', borderBottom: '1px solid #f4f5f8',
    textDecoration: 'none', background: 'white',
    cursor: comingSoon ? 'default' : 'pointer',
    width: '100%', border: 'none', fontFamily: 'inherit', textAlign: 'left',
  }

  const content = (
    <>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: danger ? '#fef2f2' : iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} color={danger ? '#ef4444' : iconColor} strokeWidth={2.2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: danger ? '#dc2626' : '#111827', lineHeight: 1.3 }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
      </div>
      {comingSoon && (
        <span style={{ fontSize: 9, fontWeight: 700, color: '#6366f1', background: '#eef2ff', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
          SOON
        </span>
      )}
      {badge && (
        <span style={{ fontSize: 9.5, fontWeight: 800, color: 'white', background: '#ef4444', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
          {badge}
        </span>
      )}
      {!comingSoon && <ChevronRight size={14} color="#cbd0da" style={{ flexShrink: 0 }} />}
    </>
  )

  if (comingSoon) return <div style={style}>{content}</div>
  if (to) return <Link to={to} style={style}>{content}</Link>
  return <button style={style} onClick={onClick}>{content}</button>
}

function Card({ children, style: extraStyle }) {
  return (
    <div style={{
      background: 'white', borderRadius: 14, border: '1px solid #e2e5ec',
      overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', ...extraStyle,
    }}>
      {children}
    </div>
  )
}

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const since = memberSince(user?.createdAt)

  function handleLogout() {
    if (!window.confirm('Log out of your account?')) return
    logout()
    navigate('/')
  }

  return (
   <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh', background: '#eef0f5' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; }
      `}</style>

     <div style={{ maxWidth: 560, margin: '0 auto', minHeight: '100vh', background: '#eef0f5' }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(160deg, #08162F 0%, #10275e 100%)',
          padding: '16px 16px 28px', borderRadius: '0 0 24px 24px',
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.85)', padding: '7px 14px', borderRadius: 10,
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00C896, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, fontWeight: 800, color: 'white',
                border: '3px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 24px rgba(0,200,150,0.3)', marginBottom: 12,
              }}>
                {(user.name || '?').charAt(0).toUpperCase()}
              </div>
              <p style={{ fontSize: 19, fontWeight: 800, color: 'white', margin: '0 0 3px', textAlign: 'center' }}>{user.name}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '0 0 10px', textAlign: 'center' }}>{user.email}</p>
              {user.isVerified && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(0,200,150,0.15)', border: '1px solid rgba(0,200,150,0.3)',
                  color: '#34d399', padding: '4px 12px', borderRadius: 20,
                  fontSize: 10.5, fontWeight: 700, marginBottom: 16,
                }}>
                  <BadgeCheck size={12} /> Verified Member
                </div>
              )}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
                background: 'rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)', width: '100%', maxWidth: 360,
              }}>
                {[
                  { label: 'Location',     val: user.location?.city || 'Campus' },
                  { label: 'Rating',       val: user.rating ? user.rating.toFixed(1) : '—' },
                  { label: 'Member Since', val: since || '—' },
                ].map((st, i) => (
                  <div key={i} style={{
                    padding: '10px 6px', textAlign: 'center',
                    borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#34d399' }}>{st.val}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
              }}>
                <User size={28} color="rgba(255,255,255,0.5)" />
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>Welcome, Guest</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Sign in to access your account</p>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '12px 14px 100px' }}>
          {user ? (
            <>
              <SectionLabel>My Activity</SectionLabel>
              <Card>
                <Row icon={ShoppingBag} iconColor="#00C896" iconBg="#ecfdf5" label="My Listings"    sub="Manage your posted items"             to="/my-listings" />
                <Row icon={Ticket}      iconColor="#be185d" iconBg="#fdf2f8" label="My Tickets"     sub="Your event ticket bookings"           to="/my-tickets" />
                <Row icon={Heart}       iconColor="#ef4444" iconBg="#fef2f2" label="Saved Items"    sub="Items you have saved"                 to="/saved" />
                <Row icon={PlusCircle}  iconColor="#059669" iconBg="#ecfdf5" label="Post a Listing" sub="List an item, service or event"       to="/create" badge="New" />
              </Card>

              <SectionLabel>Seller Tools</SectionLabel>
              <Card>
                <Row icon={BarChart2}  iconColor="#6366f1" iconBg="#eef2ff" label="Listing Analytics"    sub="Views, clicks and saves per listing"       comingSoon />
                <Row icon={CreditCard} iconColor="#0891b2" iconBg="#ecfeff" label="Earnings Dashboard"   sub="Track revenue from ticket events"          comingSoon />
                <Row icon={TrendingUp} iconColor="#d97706" iconBg="#fffbeb" label="Seller Level"         sub="Bronze, Silver, Gold based on activity"    comingSoon />
                <Row icon={Zap}        iconColor="#f59e0b" iconBg="#fffbeb" label="Boost Listing"        sub="Promote your listing to the top"           comingSoon />
                <Row icon={Star}       iconColor="#eab308" iconBg="#fefce8" label="Reviews & Ratings"    sub="Feedback from your buyers"                 comingSoon />
              </Card>

              <SectionLabel>Account</SectionLabel>
              <Card>
                <Row icon={User}    iconColor="#2563eb" iconBg="#eff6ff" label="Personal Information"       sub="Name, phone and email"                    to={'/profile/' + user._id} />
                <Row icon={Lock}    iconColor="#7c3aed" iconBg="#f5f3ff" label="Change Password"             sub="Update your password"                     comingSoon />
                <Row icon={Bell}    iconColor="#d97706" iconBg="#fffbeb" label="Notification Preferences"   sub="Control what you are notified about"      comingSoon />
                <Row icon={MapPin}  iconColor="#059669" iconBg="#ecfdf5" label="Default Location"           sub="Set your city for faster listing"         comingSoon />
              </Card>

              {user.isAdmin && (<>
                <SectionLabel>Administration</SectionLabel>
                <Card>
                  <Row icon={LayoutDashboard} iconColor="#7c3aed" iconBg="#f5f3ff" label="Dashboard"       to="/admin" />
                  <Row icon={Users}           iconColor="#7c3aed" iconBg="#f5f3ff" label="Manage Users"    to="/admin/users" />
                  <Row icon={ShoppingBag}     iconColor="#7c3aed" iconBg="#f5f3ff" label="Manage Listings" to="/admin/listings" />
                  <Row icon={Flag}            iconColor="#7c3aed" iconBg="#f5f3ff" label="Reports"         to="/admin/reports" />
                  <Row icon={BarChart3}       iconColor="#7c3aed" iconBg="#f5f3ff" label="Analytics"       to="/admin/analytics" />
                  <Row icon={History}         iconColor="#7c3aed" iconBg="#f5f3ff" label="Activity Feed"   to="/admin/activity" />
                </Card>
              </>)}

              <SectionLabel>Support</SectionLabel>
              <Card>
                <Row icon={HelpCircle}    iconColor="#d97706" iconBg="#fffbeb" label="Help Centre"      to="/help/how-to-buy" />
                <Row icon={Store}         iconColor="#d97706" iconBg="#fffbeb" label="How to Sell"      to="/help/how-to-sell" />
                <Row icon={ShieldCheck}   iconColor="#d97706" iconBg="#fffbeb" label="Staying Safe"     to="/help/safety" />
                <Row icon={MessageCircle} iconColor="#d97706" iconBg="#fffbeb" label="Contact Support"  to="/help/contact" />
                <Row icon={Bug}           iconColor="#d97706" iconBg="#fffbeb" label="Report a Bug"     to="/help/bug" />
                <Row icon={Star}          iconColor="#eab308" iconBg="#fefce8" label="Rate the App"     comingSoon />
              </Card>

              <SectionLabel>Legal & Policies</SectionLabel>
              <Card>
                <Row icon={FileText}    iconColor="#6b7280" iconBg="#f3f4f6" label="Terms of Use"          to="/legal/terms" />
                <Row icon={Lock}        iconColor="#6b7280" iconBg="#f3f4f6" label="Privacy Policy"        to="/legal/privacy" />
                <Row icon={ShieldCheck} iconColor="#6b7280" iconBg="#f3f4f6" label="Privacy Centre"        to="/legal/privacy-centre" />
                <Row icon={Cookie}      iconColor="#6b7280" iconBg="#f3f4f6" label="Cookie Policy"         to="/legal/cookies" />
                <Row icon={Scale}       iconColor="#6b7280" iconBg="#f3f4f6" label="Community Guidelines"  to="/legal/guidelines" />
                <Row icon={Building2}   iconColor="#6b7280" iconBg="#f3f4f6" label="About Us"              to="/about" />
              </Card>

              <SectionLabel>Account Actions</SectionLabel>
              <Card>
                <Row icon={LogOut} label="Log Out" sub="Sign out of your account" danger onClick={handleLogout} />
              </Card>

              <div style={{ marginTop: 10 }}>
                {!showDelete ? (
                  <button
                    onClick={() => setShowDelete(true)}
                    style={{
                      background: 'none', border: 'none', color: '#9ca3af',
                      fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                      padding: '8px 4px', display: 'block', width: '100%', textAlign: 'center',
                    }}
                  >
                    Delete Account
                  </button>
                ) : (
                  <Card style={{ border: '1px solid #fecaca' }}>
                    <div style={{ padding: 16, textAlign: 'center' }}>
                      <Trash2 size={22} color="#ef4444" style={{ marginBottom: 8 }} />
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Delete your account?</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 14px' }}>
                        This will permanently remove all your listings, tickets and data. This cannot be undone.
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setShowDelete(false)}
                          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => alert('Delete account feature coming soon.')}
                          style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <>
              <SectionLabel>Explore Platform</SectionLabel>
              <Card>
                <Row icon={ShoppingBag} iconColor="#2563eb" iconBg="#eff6ff" label="Marketplace"   to="/marketplace" />
                <Row icon={Wrench}      iconColor="#7c3aed" iconBg="#f5f3ff" label="Services"      to="/services" />
                <Row icon={Briefcase}   iconColor="#d97706" iconBg="#fffbeb" label="Jobs"          to="/jobs" />
                <Row icon={PartyPopper} iconColor="#be185d" iconBg="#fdf2f8" label="Events"        to="/events" />
                <Row icon={Home}        iconColor="#0891b2" iconBg="#ecfeff" label="Accommodation" to="/accommodation" />
              </Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                <Link to="/login" style={{
                  display: 'block', padding: '14px 16px', borderRadius: 13,
                  background: 'white', color: '#08162F', border: '1px solid #e5e7eb',
                  fontWeight: 700, fontSize: 14, textAlign: 'center',
                }}>
                  Login to Your Account
                </Link>
                <Link to="/register" style={{
                  display: 'block', padding: '14px 16px', borderRadius: 13,
                  background: 'linear-gradient(135deg,#00C896,#059669)', color: 'white',
                  fontWeight: 700, fontSize: 14, textAlign: 'center',
                }}>
                  Register Free — Join the Community
                </Link>
              </div>
            </>
          )}

          <p style={{ textAlign: 'center', fontSize: 11, color: '#c4c9d4', fontWeight: 600, marginTop: 24 }}>
            Scalable<span style={{ color: '#00C896' }}>nexus</span> v1.0 · Built for Campus Zimbabwe
          </p>
        </div>
      </div>
    </div>
  )
}