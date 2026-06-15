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
  const [copied, setCopied] = useState(false)

  useEffect(function() {
    api.get('/listings/' + id)
      .then(function(res) { setListing(res.data) })
      .catch(function() { navigate('/') })
      .finally(function() { setLoading(false) })
  }, [id])

  function getImg(img) {
    if (!img) return null
    if (img.startsWith('http')) return img
    return 'https://swiftkart2-backend.onrender.com/' + img.replace(/\\/g, '/')
  }

  function handleReport(e) {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!reportReason) { setReportError('Please select a reason'); return }
    setReportLoading(true)
    setReportError('')
    api.post('/reports', { listingId: id, reason: reportReason, details: reportDetails })
      .then(function() {
        setReportSuccess('Report submitted. Thank you!')
        setTimeout(function() {
          setShowReport(false)
          setReportSuccess('')
          setReportReason('')
          setReportDetails('')
        }, 2000)
      })
      .catch(function(err) {
        setReportError(err.response?.data?.message || 'Failed to submit report.')
      })
      .finally(function() { setReportLoading(false) })
  }

  function handleShareWA() {
    const url = window.location.href
    const text = 'Check out this listing on SwiftKart: *' + listing.title + '* - R' + listing.price + '\n' + url
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(function() { setCopied(false) }, 2000)
  }

  if (loading) {
    return (
      <p style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Loading...
      </p>
    )
  }

  if (!listing) return null

  const phone = listing.phone?.replace(/\D/g, '') || ''
  const waText = 'Hi, I am interested in your listing: ' + listing.title
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(waText)
  const price = 'R ' + Number(listing.price).toLocaleString()

  const REPORTS = ['Scam or fraud', 'Fake listing', 'Inappropriate content', 'Wrong price', 'Duplicate listing', 'Other']

  const s = {
    wrap: { maxWidth: '960px', margin: '0 auto', padding: '24px 20px 80px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
    backBtn: {
      background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px',
      borderRadius: '10px', fontSize: '13px', color: '#374151', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '6px',
      fontFamily: 'inherit', fontWeight: 600, boxShadow: '0 1px 4px rgba(0,0,0,.06)',
    },
    shareWA: {
      background: '#25d366', color: 'white', border: 'none', padding: '8px 16px',
      borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit',
      boxShadow: '0 3px 10px rgba(37,211,102,.3)',
    },
    shareCopy: {
      background: 'white', color: '#374151', border: '1px solid #e2e8f0',
      padding: '8px 14px', borderRadius: '10px', fontSize: '12px',
      fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
    },
    card: {
      background: 'white', borderRadius: '20px',
      boxShadow: '0 4px 24px rgba(0,0,0,.08)', padding: '28px',
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' },
    mainImg: {
      width: '100%', aspectRatio: '4/5', borderRadius: '16px',
      overflow: 'hidden', background: '#f3f4f6', marginBottom: '12px',
    },
    thumbRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    infoCol: { display: 'flex', flexDirection: 'column' },
    catTag: {
      display: 'inline-block', fontSize: '11px', fontWeight: 700,
      padding: '3px 12px', borderRadius: '20px',
      background: '#ecfdf5', color: '#059669',
      marginBottom: '12px', alignSelf: 'flex-start',
    },
    title: { fontSize: '22px', fontWeight: 800, color: '#08162F', marginBottom: '8px', lineHeight: 1.3 },
    priceText: { fontSize: '30px', fontWeight: 800, color: '#08162F', marginBottom: '12px', letterSpacing: '-1px' },
    location: { color: '#6b7280', fontSize: '13px', marginBottom: '16px' },
    descLabel: { fontSize: '12px', fontWeight: 700, color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.5px' },
    desc: { fontSize: '14px', color: '#374151', lineHeight: 1.7, marginBottom: '20px' },
    seller: {
      background: '#f8fafc', borderRadius: '12px', padding: '14px 16px',
      marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px',
      cursor: 'pointer', border: '1px solid #f1f5f9',
    },
    avatar: {
      width: '40px', height: '40px', borderRadius: '50%',
      background: 'linear-gradient(135deg,#08162F,#1e3a8a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '16px', color: 'white', fontWeight: 800, flexShrink: 0,
    },
    safety: {
      background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px',
      padding: '10px 14px', marginBottom: '16px', fontSize: '12px',
      color: '#92400e', lineHeight: 1.5,
    },
    waBtn: {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      width: '100%', background: 'linear-gradient(135deg,#25d366,#16a34a)',
      color: 'white', border: 'none', padding: '14px', borderRadius: '12px',
      fontSize: '15px', fontWeight: 800, cursor: 'pointer',
      fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(37,211,102,.35)',
      marginBottom: '10px', textDecoration: 'none',
    },
    reportBtn: {
      width: '100%', background: 'transparent', color: '#ef4444',
      border: '1px solid #fecaca', padding: '10px', borderRadius: '10px',
      fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    },
    reportBox: {
      background: 'white', borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,.08)', padding: '24px', marginTop: '16px',
    },
  }

  return (
    <div style={s.wrap}>

      {/* Top bar */}
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={function() { navigate(-1) }}>← Back</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={s.shareWA} onClick={handleShareWA}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share
          </button>
          <button style={s.shareCopy} onClick={handleCopyLink}>
            {copied ? '✅ Copied!' : '🔗 Copy Link'}
          </button>
        </div>
      </div>

      {/* Card */}
      <div style={s.card}>
        <div style={s.grid}>

          {/* Images */}
          <div>
            <div style={s.mainImg}>
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={getImg(listing.images[activeImage])}
                  alt={listing.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>
                  🛍️
                </div>
              )}
            </div>
            {listing.images && listing.images.length > 1 && (
              <div style={s.thumbRow}>
                {listing.images.map(function(img, i) {
                  return (
                    <img
                      key={i}
                      src={getImg(img)}
                      alt={'thumb-' + i}
                      onClick={function() { setActiveImage(i) }}
                      style={{
                        width: '58px', height: '58px', objectFit: 'cover',
                        borderRadius: '10px', cursor: 'pointer',
                        border: activeImage === i ? '2px solid #00C896' : '2px solid transparent',
                        opacity: activeImage === i ? 1 : 0.65, transition: 'all .2s',
                      }}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={s.infoCol}>

            {listing.category && (
              <span style={s.catTag}>{listing.category}</span>
            )}

            <h1 style={s.title}>{listing.title}</h1>
            <p style={s.priceText}>{price}</p>

            <p style={s.location}>
              📍 {listing.location?.area ? listing.location.area + ', ' : ''}
              {listing.location?.city}, {listing.location?.country}
            </p>

            {listing.description && (
              <div style={{ marginBottom: '20px' }}>
                <p style={s.descLabel}>Description</p>
                <p style={s.desc}>{listing.description}</p>
              </div>
            )}

            {listing.user && (
              <div style={s.seller} onClick={function() { navigate('/profile/' + listing.user._id) }}>
                <div style={s.avatar}>
                  {listing.user.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {listing.user.name}
                  </p>
                  <p style={{ fontSize: '11px', color: '#059669', fontWeight: 600, margin: 0 }}>
                    ✔ Verified Seller
                  </p>
                </div>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>View Profile →</span>
              </div>
            )}

            <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '16px' }}>
              Posted {new Date(listing.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div style={s.safety}>
              ⚠️ <strong>Safety Tip:</strong> Always meet in a public place before exchanging money. SwiftKart is not responsible for transactions between users.
            </div>

            <a href={waLink} target="_blank" rel="noopener noreferrer" style={s.waBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact Seller on WhatsApp
            </a>

            <button style={s.reportBtn} onClick={function() { setShowReport(!showReport) }}>
              🚩 Report this Listing
            </button>

          </div>
        </div>
      </div>

      {/* Report form */}
      {showReport && (
        <div style={s.reportBox}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
            🚩 Report this Listing
          </p>

          {reportSuccess && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {reportSuccess}
            </div>
          )}

          {reportError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {reportError}
            </div>
          )}

          <form onSubmit={handleReport}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Reason *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {REPORTS.map(function(r) {
                  return (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reportReason === r}
                        onChange={function(e) { setReportReason(e.target.value) }}
                      />
                      {r}
                    </label>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Additional Details (optional)
              </label>
              <textarea
                value={reportDetails}
                onChange={function(e) { setReportDetails(e.target.value) }}
                placeholder="Provide more details..."
                rows={3}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={function() { setShowReport(false) }}
                style={{ flex: 1, background: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reportLoading}
                style={{ flex: 1, background: reportLoading ? '#fca5a5' : '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: reportLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
              >
                {reportLoading ? 'Submitting...' : '🚩 Submit Report'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}