import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav style={{
      backgroundColor: '#1a56db',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      {/* Main Bar */}
      <div style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>

        {/* LEFT — Logo */}
        <Link to="/" style={{
          color: 'white', fontWeight: '700',
          fontSize: '18px', display: 'flex',
          alignItems: 'center', gap: '6px',
          whiteSpace: 'nowrap'
        }}>
          🛒 SwiftKart
        </Link>

        {/* CENTER — Nav Items (desktop only) */}
        <div style={{
          display: 'flex', gap: '24px',
          position: 'absolute', left: '50%',
          transform: 'translateX(-50%)'
        }}
          className="desktop-nav"
        >
          {['Marketplace', 'Services', 'Jobs', 'Events'].map(item => (
            <span key={item} style={{
              color: 'white', fontSize: '13px',
              fontWeight: '500', cursor: 'default',
              whiteSpace: 'nowrap'
            }}>{item}</span>
          ))}
        </div>

        {/* RIGHT — Auth (desktop) + Hamburger (mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* Desktop Auth */}
          <div className="desktop-auth" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user ? (
              <>
                <span style={{ color: 'white', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  Hi, {user.name}
                </span>
                <Link to="/my-listings" style={{
                  backgroundColor: 'white', color: '#1a56db',
                  padding: '7px 14px', borderRadius: '20px',
                  fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap'
                }}>My Listings</Link>
                <button onClick={handleLogout} style={{
                  backgroundColor: '#fbbf24', color: '#1e3a8a',
                  border: 'none', padding: '7px 14px',
                  borderRadius: '20px', fontWeight: '600',
                  fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap'
                }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  backgroundColor: 'white', color: '#1a56db',
                  padding: '7px 14px', borderRadius: '20px',
                  fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap'
                }}>Login</Link>
                <Link to="/register" style={{
                  backgroundColor: '#fbbf24', color: '#1e3a8a',
                  padding: '7px 14px', borderRadius: '20px',
                  fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap'
                }}>Register</Link>
              </>
            )}
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.5)',
              color: 'white', padding: '6px 10px',
              borderRadius: '6px', cursor: 'pointer',
              fontSize: '18px', display: 'none'
            }}
          >☰</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          backgroundColor: '#1648c0',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {['Marketplace', 'Services', 'Jobs', 'Events'].map(item => (
            <span key={item} style={{
              color: 'white', fontSize: '14px',
              fontWeight: '500', padding: '4px 0'
            }}>{item}</span>
          ))}
          <hr style={{ border: '1px solid rgba(255,255,255,0.2)', margin: '4px 0' }} />
          {user ? (
            <>
              <span style={{ color: 'white', fontSize: '13px' }}>Hi, {user.name}</span>
              <Link to="/my-listings" onClick={() => setMenuOpen(false)} style={{
                backgroundColor: 'white', color: '#1a56db',
                padding: '10px 16px', borderRadius: '8px',
                fontWeight: '600', fontSize: '13px',
                textAlign: 'center'
              }}>My Listings</Link>
              <Link to="/create" onClick={() => setMenuOpen(false)} style={{
                backgroundColor: '#fbbf24', color: '#1e3a8a',
                padding: '10px 16px', borderRadius: '8px',
                fontWeight: '600', fontSize: '13px',
                textAlign: 'center'
              }}>+ Post Listing</Link>
              <button onClick={handleLogout} style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.5)',
                color: 'white', padding: '10px 16px',
                borderRadius: '8px', fontWeight: '600',
                fontSize: '13px', cursor: 'pointer'
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{
                backgroundColor: 'white', color: '#1a56db',
                padding: '10px 16px', borderRadius: '8px',
                fontWeight: '600', fontSize: '13px',
                textAlign: 'center'
              }}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                backgroundColor: '#fbbf24', color: '#1e3a8a',
                padding: '10px 16px', borderRadius: '8px',
                fontWeight: '600', fontSize: '13px',
                textAlign: 'center'
              }}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}