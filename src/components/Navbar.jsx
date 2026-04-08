import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      backgroundColor: '#1a56db',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto',
        gap: '12px'
      }}>

        {/* LEFT — Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {user ? (
            <>
              <Link to="/my-listings" style={{
                backgroundColor: 'white', color: '#1a56db',
                padding: '7px 14px', borderRadius: '20px',
                fontWeight: '600', fontSize: '12px',
                whiteSpace: 'nowrap'
              }}>My Listings</Link>
              <span style={{ color: 'white', fontSize: '12px', whiteSpace: 'nowrap' }}>
                Hi, {user.name}
              </span>
              <button onClick={handleLogout} style={{
                backgroundColor: '#fbbf24', color: '#1e3a8a',
                border: 'none', padding: '7px 14px',
                borderRadius: '20px', fontWeight: '600',
                fontSize: '12px', cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                backgroundColor: 'white', color: '#1a56db',
                padding: '7px 14px', borderRadius: '20px',
                fontWeight: '600', fontSize: '12px',
                whiteSpace: 'nowrap'
              }}>Login</Link>
              <Link to="/register" style={{
                backgroundColor: '#fbbf24', color: '#1e3a8a',
                padding: '7px 14px', borderRadius: '20px',
                fontWeight: '600', fontSize: '12px',
                whiteSpace: 'nowrap'
              }}>Register</Link>
            </>
          )}
        </div>

        {/* CENTER — Plain Text Nav Items */}
        <div style={{
          display: 'flex',
          gap: '24px',
          flexShrink: 1
        }}>
          {['Marketplace', 'Services', 'Jobs', 'Events'].map(item => (
            <span key={item} style={{
              color: 'white', fontSize: '13px',
              fontWeight: '500', cursor: 'default',
              whiteSpace: 'nowrap'
            }}>{item}</span>
          ))}
        </div>

        {/* RIGHT — Home Button + SwiftKart fixed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Link to="/" style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '7px 14px',
            borderRadius: '20px',
            fontWeight: '600',
            fontSize: '12px',
            border: '1px solid rgba(255,255,255,0.4)',
            whiteSpace: 'nowrap'
          }}>🏠 Home</Link>

          <span style={{
            color: 'white',
            fontWeight: '700',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}>
            🛒 SwiftKart
          </span>
        </div>

      </div>
    </nav>
  )
}