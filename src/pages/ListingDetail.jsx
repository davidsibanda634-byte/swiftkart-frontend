import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportSuccess, setReportSuccess] = useState('')
  const [reportError, setReportError] = useState('')

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

  const getImageUrl = (img) => {
    if (!img) return null
    if (img.startsWith('http')) return img
    return `https://swiftkart2-backend.onrender.com/${img.replace(/\\/g, '/')}`
  }

  const handleReport = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!reportReason) { setReportError('Please select a reason'); return }
    setReportLoading(true)
    setReportError('')
    try {
      await api.post('/reports', {
        listingId: id,
        reason: reportReason,
        details: reportDetails
      })
      setReportSuccess('Report submitted successfully. Thank you!')
      setTimeout(() => {
        setShowReport(false)
        setReportSuccess('')
        setReportReason('')
        setReportDetails('')
      }, 2000)
    } catch (err) {
      setReportError(err.response?.data?.message || 'Failed to submit report.')
    } finally {
      setReportLoading(false)
    }
  }

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
      <button onClick={() => navigate(-1)} style={{
        backgroundColor: 'transparent',
        border: '1px solid #d1d5db',
        padding: '8px 16px', borderRadius: '8px',
        fontSize: '13px', color: '#374151',
        cursor: 'pointer', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '6px'
      }}>← Back</button>

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
          <div style={{
            width: '100%', height: '280px',
            borderRadius: '12px', overflow: 'hidden',
            backgroundColor: '#f3f4f6', marginBottom: '12px'
          }}>
            {listing.images?.length > 0 ? (
              <img
                src={getImageUrl(listing.images[activeImage])}
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

          {listing.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {listing.images.map((img, i) => (
                <img key={i} src={getImageUrl(img)} alt={`thumb-${i}`}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
            📍 {listing.location?.area && `${listing.location.area}, `}
            {listing.location?.city}, {listing.location?.country}
          </div>

          {listing.description && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Description</p>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{listing.description}</p>
            </div>
          )}

          {listing.user && (
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginBottom: '4px' }}>POSTED BY</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{listing.user.name}</p>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{listing.phone}</p>
            </div>
          )}

          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
            Posted on {new Date(listing.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>

          {/* Safety Tip */}
          <div style={{
            backgroundColor: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: '8px', padding: '10px 14px', marginBottom: '16px'
          }}>
            <p style={{ fontSize: '12px', color: '#92400e' }}>
              ⚠️ <strong>Safety Tip:</strong> Always meet in a public place before exchanging money. SwiftKart is not responsible for transactions between users.
            </p>
          </div>

          {/* WhatsApp Button */}
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ marginBottom: '12px' }}>
            <button style={{
              width: '100%', backgroundColor: '#25d366',
              color: 'white', border: 'none', padding: '14px',
              borderRadius: '10px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              💬 Contact Seller on WhatsApp
            </button>
          </a>

          {/* Report Button */}
          <button
            onClick={() => setShowReport(!showReport)}
            style={{
              width: '100%', backgroundColor: 'transparent',
              color: '#ef4444', border: '1px solid #fecaca',
              padding: '10px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer'
            }}
          >🚩 Report this Listing</button>
        </div>
      </div>

      {/* Report Form */}
      {showReport && (
        <div style={{
          backgroundColor: 'white', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '28px', marginTop: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
            🚩 Report this Listing
          </h3>

          {reportSuccess && (
            <div style={{
              backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#16a34a', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '16px'
            }}>{reportSuccess}</div>
          )}

          {reportError && (
            <div style={{
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '16px'
            }}>{reportError}</div>
          )}

          <form onSubmit={handleReport}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Reason *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Scam or fraud', 'Fake listing', 'Inappropriate content', 'Wrong price', 'Duplicate listing', 'Other'].map(reason => (
                  <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                    <input
                      type="radio" name="reason" value={reason}
                      checked={reportReason === reason}
                      onChange={e => setReportReason(e.target.value)}
                    />
                    {reason}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Additional Details (optional)
              </label>
              <textarea
                value={reportDetails}
                onChange={e => setReportDetails(e.target.value)}
                placeholder="Provide more details about the issue..."
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #d1d5db', borderRadius: '8px',
                  fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box', resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setShowReport(false)} style={{
                flex: 1, backgroundColor: 'white', color: '#374151',
                border: '1px solid #d1d5db', padding: '10px',
                borderRadius: '8px', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer'
              }}>Cancel</button>
              <button type="submit" disabled={reportLoading} style={{
                flex: 1, backgroundColor: reportLoading ? '#fca5a5' : '#ef4444',
                color: 'white', border: 'none', padding: '10px',
                borderRadius: '8px', fontSize: '14px',
                fontWeight: '600', cursor: reportLoading ? 'not-allowed' : 'pointer'
              }}>{reportLoading ? 'Submitting...' : '🚩 Submit Report'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}