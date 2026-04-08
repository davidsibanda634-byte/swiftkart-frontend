import { useNavigate } from 'react-router-dom'

export default function ListingCard({ listing }) {
  const navigate = useNavigate()

  const imageUrl = listing.images?.[0]
    ? `http://localhost:5000/${listing.images[0].replace(/\\/g, '/')}`
    : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'

  const phone = listing.phone?.replace(/\D/g, '')
  const message = `Hi, I am interested in your listing: ${listing.title}`
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Clickable area */}
      <div onClick={() => navigate(`/listings/${listing._id}`)}>
        <img
          src={imageUrl}
          alt={listing.title}
          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
        />
        <div style={{ padding: '12px' }}>
          <p style={{ fontWeight: '600', fontSize: '14px', color: '#111827', marginBottom: '4px' }}>
            {listing.title}
          </p>
          <p style={{ color: '#1a56db', fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>
            ${listing.price}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>
            {listing.location?.city}{listing.location?.area ? `, ${listing.location.area}` : ''}
          </p>
        </div>
      </div>

      {/* WhatsApp Button */}
      <div style={{ padding: '0 12px 12px' }}>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <button style={{
            width: '100%',
            backgroundColor: '#25d366',
            color: 'white',
            border: 'none',
            padding: '9px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}>💬 Contact on WhatsApp</button>
        </a>
      </div>
    </div>
  )
}