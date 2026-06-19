export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '24px 40px',
      textAlign: 'center',
      marginTop: '60px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '10px' }}>
        {['About', 'Contact', 'Privacy Policy', 'Terms'].map(link => (
          <a key={link} href="#" style={{ color: '#6b7280', fontSize: '13px' }}
            onMouseOver={e => e.target.style.color = '#1a56db'}
            onMouseOut={e => e.target.style.color = '#6b7280'}
          >{link}</a>
        ))}
      </div>
      <p style={{ color: '#9ca3af', fontSize: '13px' }}>© 2026 SwiftKart. All rights reserved.</p>
    </footer>
  )
}