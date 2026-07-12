import { Link } from 'react-router-dom'
import LegalLayout from './LegalLayout'

const visibility = [
  { icon: '👁️', bg: '#ecfdf5', title: 'What We Can See', body: 'Your name, email, phone number, and the listings you post. Basic usage data like which pages you visit.' },
  { icon: '🙈', bg: '#eff6ff', title: 'What We Cannot See', body: 'Your WhatsApp conversations with sellers. Your bank or EcoCash transactions. Your private messages are yours alone.' },
  { icon: '🌍', bg: '#fffbeb', title: 'What Other Users Can See', body: 'Your name, profile initial, public listings, and general city. Your email and full phone number are never shown to other users.' },
  { icon: '🔐', bg: '#f5f3ff', title: 'What Only You Can See', body: 'Your saved items, account settings, email address, and full phone number in your profile.' },
]

const rights = [
  { icon: '📋', bg: '#ecfdf5', title: 'Access Your Data', body: 'Request a full copy of all data we hold about you. We respond within 7 days.', btn: 'Request Copy', to: '/help/contact' },
  { icon: '✏️', bg: '#eff6ff', title: 'Correct Your Data', body: 'Update inaccurate information directly in your profile, or contact us for help.', btn: 'Edit Profile', to: '/profile-menu' },
  { icon: '🗑️', bg: '#fef2f2', title: 'Delete Your Data', body: 'Delete your account and all associated data. This action is permanent.', btn: 'Contact Support', to: '/help/contact' },
  { icon: '📤', bg: '#fffbeb', title: 'Export Your Data', body: 'Download a copy of your listings, profile and activity in a portable format.', btn: 'Request Export', to: '/help/contact' },
]

export default function PrivacyCentre() {
  return (
    <LegalLayout icon="🛡️" title="Privacy Centre" lastUpdated="January 2025" intro="Understand and control exactly how your data is used on Scalablenexus. Your privacy is a right, not an afterthought.">

      <div className="ll-section" style={{ marginBottom: '16px' }}>
        <div className="ll-section-header">
          <div className="ll-section-num">👁️</div>
          <p className="ll-section-title">Data Visibility — Who Sees What</p>
        </div>
        {visibility.map((v, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', padding: '16px 20px', borderBottom: i < visibility.length - 1 ? '1px solid #f8fafc' : 'none', alignItems: 'flex-start' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{v.icon}</div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{v.title}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.75 }}>{v.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ll-section" style={{ marginBottom: '20px' }}>
        <div className="ll-section-header">
          <div className="ll-section-num">⚖️</div>
          <p className="ll-section-title">Your Privacy Rights</p>
        </div>
        {rights.map((r, i) => (
          <div key={i} style={{ padding: '16px 20px', borderBottom: i < rights.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>{r.title}</p>
              <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#6b7280', lineHeight: 1.7 }}>{r.body}</p>
              <Link to={r.to} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#ecfdf5', color: '#059669', border: '1px solid #bbf7d0', padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                {r.btn} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '11px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Related Policies <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { icon: '🔐', title: 'Privacy Policy', sub: 'Full data policy', to: '/legal/privacy' },
          { icon: '🍪', title: 'Cookie Policy', sub: 'How we use cookies', to: '/legal/cookies' },
          { icon: '📋', title: 'Terms of Use', sub: 'Platform rules', to: '/legal/terms' },
          { icon: '📜', title: 'Community Guidelines', sub: 'How we treat each other', to: '/legal/guidelines' },
        ].map(l => (
          <Link key={l.title} to={l.to} style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #f1f5f9', textDecoration: 'none', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>{l.icon}</div>
            <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{l.title}</p>
            <p style={{ margin: 0, fontSize: '11.5px', color: '#9ca3af' }}>{l.sub}</p>
          </Link>
        ))}
      </div>
    </LegalLayout>
  )
}