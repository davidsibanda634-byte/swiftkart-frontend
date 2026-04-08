import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/listings/${id}`)
        setListing(data)
      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return (
    <p style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>Loading...</p>
  )

  if (!listing) return null

  const phone = listing.phone?.replace(/\D/g, '')
  const message = `Hi, I am interested in your listing: ${listing.title}`
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #d1d5db',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#374151',
          cursor: 'pointer',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >← Back</button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '28px'
      }}>

        {/* LEFT — Images */}
        <div>
          {/* Main Image */}
          <div style={{
            width: '100%', height: '280px',
            borderRadius: '12px', overflow: 'hidden',
            backgroundColor: '#f3f4f6', marginBottom: '12px'
          }}>
            {listing.images?.length > 0 ? (
              <img
                src={`http://localhost:5000/${listing.images[activeImage]?.replace(/\\/g, '/')}`}
                alt={listing.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '48px'
              }}>🛍️</div>
            )}
          </div>

          {/* Thumbnail Row */}
          {listing.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {listing.images.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000/${img.replace(/\\/g, '/')}`}
                  alt={`thumb-${i}`}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: '60px', height: '60px',
                    objectFit: 'cover', borderRadius: '8px',
                    cursor: 'pointer',
                    border: activeImage === i ? '2px solid #1a56db' : '2px solid transparent',
                    opacity: activeImage === i ? 1 : 0.7
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Details */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            {listing.title}
          </h1>

          <p style={{ fontSize: '28px', fontWeight: '700', color: '#1a56db', marginBottom: '16px' }}>
            ${listing.price}
          </p>

          {/* Location */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#6b7280', fontSize: '13px', marginBottom: '16px'
          }}>
            📍 {listing.location?.area && `${listing.location.area}, `}
            {listing.location?.city}, {listing.location?.country}
          </div>

          {/* Description */}
          {listing.description && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Description
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                {listing.description}
              </p>
            </div>
          )}

          {/* Seller Info */}
          {listing.user && (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginBottom: '4px' }}>
                POSTED BY
              </p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                {listing.user.name}
              </p>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>
                {listing.phone}
              </p>
            </div>
          )}

          {/* Posted Date */}
          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
            Posted on {new Date(listing.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>

          {/* WhatsApp Button */}
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto' }}>
            <button style={{
              width: '100%',
              backgroundColor: '#25d366',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              💬 Contact Seller on WhatsApp
            </button>
          </a>
        </div>

      </div>
    </div>
  )
}