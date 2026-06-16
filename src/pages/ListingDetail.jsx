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
    const text = 'Check out this listing on SwiftKart: *' + listing.title + '* - $' + listing.price + '\n' + url
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(function() { setCopied(false) }, 2000)
  }

  function handleWhatsApp() {
    const phone = listing.phone?.replace(/\D/g, '') || ''
    const waText = 'Hi, I am interested in your listing: ' + listing.title
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(waText), '_blank')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTop: '3px solid #1e4db7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading listing...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!listing) return null

  const price = '$' + Number(listing.price).toLocaleString()
  const REPORTS = ['Scam or fraud', 'Fake listing', 'Inappropriate content', 'Wrong price', 'Duplicate listing', 'Other']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ld-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f4f7fb;
          min-height: 100vh;
          padding-bottom: 40px;
        }

        .ld-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 16px 60px;
        }

        /* Top bar */
        .ld-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ld-back {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          color: '#374151';
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          font-weight: 600;
          box-shadow: 0 1px 4px rgba(0,0,0,.06);
          transition: all 0.2s;
        }
        .ld-back:hover { background: #f8fafc; }

        .ld-share-row {
          display: flex;
          gap: 8px;
        }

        .ld-share-wa {
          background: #25d366;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          box-shadow: 0 3px 10px rgba(37,211,102,.3);
          transition: all 0.2s;
        }
        .ld-share-wa:hover { transform: translateY(-1px); }

        .ld-copy {
          background: white;
          color: #374151;
          border: 1px solid #e2e8f0;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .ld-copy:hover { background: #f8fafc; }

        /* Main card */
        .ld-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,.07);
          overflow: hidden;
        }

        /* Grid — side by side on desktop, stacked on mobile */
        .ld-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        /* Image column */
        .ld-img-col {
          padding: 24px;
          border-right: 1px solid #f1f5f9;
        }

        .ld-main-img {
          width: 100%;
          aspect-ratio: 4/5;
          border-radius: 14px;
          overflow: hidden;
          background: #f3f4f6;
          margin-bottom: 12px;
          position: relative;
        }

        .ld-main-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .ld-thumb-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ld-thumb {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .ld-thumb.active {
          border-color: #1e4db7;
          opacity: 1;
        }

        .ld-thumb:not(.active) {
          opacity: 0.6;
        }

        .ld-thumb:hover { opacity: 1; }

        /* Info column */
        .ld-info-col {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .ld-cat-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          background: #ecfdf5;
          color: #059669;
          margin-bottom: 14px;
          align-self: flex-start;
          border: 1px solid #d1fae5;
        }

        .ld-title {
          font-size: clamp(18px, 3vw, 24px);
          font-weight: 800;
          color: #08162F;
          margin: 0 0 10px;
          line-height: 1.25;
        }

        .ld-price {
          font-size: clamp(26px, 4vw, 34px);
          font-weight: 800;
          color: #08162F;
          letter-spacing: -1px;
          margin: 0 0 12px;
        }

        .ld-location {
          color: #6b7280;
          font-size: 13px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .ld-desc-label {
          font-size: 11px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .ld-desc {
          font-size: 14px;
          color: #374151;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .ld-seller {
          background: #f8fafc;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          border: 1px solid #f1f5f9;
          transition: background 0.2s;
        }
        .ld-seller:hover { background: #f1f5f9; }

        .ld-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg,#08162F,#1e3a8a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          color: white;
          font-weight: 800;
          flex-shrink: 0;
        }

        .ld-posted {
          font-size: 11.5px;
          color: #9ca3af;
          margin-bottom: 14px;
        }

        .ld-safety {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 16px;
          font-size: 12px;
          color: #92400e;
          line-height: 1.6;
        }

        .ld-wa-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          background: linear-gradient(135deg,#25d366,#16a34a);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 13px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 16px rgba(37,211,102,.35);
          margin-bottom: 10px;
          transition: all 0.2s;
        }
        .ld-wa-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,211,102,.45); }

        .ld-report-btn {
          width: 100%;
          background: transparent;
          color: #ef4444;
          border: 1px solid #fecaca;
          padding: 11px;
          border-radius: 11px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .ld-report-btn:hover { background: #fef2f2; }

        /* Report box */
        .ld-report-box {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,.08);
          padding: 24px;
          margin-top: 16px;
          border: 1px solid #f1f5f9;
        }

        .ld-radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
          color: #374151;
          padding: 6px 0;
        }

        .ld-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          resize: vertical;
          font-family: inherit;
          transition: border 0.2s;
        }
        .ld-textarea:focus { border-color: #1e4db7; }

        /* MOBILE */
        @media (max-width: 700px) {
          .ld-grid {
            grid-template-columns: 1fr;
          }
          .ld-img-col {
            padding: 16px 16px 0;
            border-right: none;
            border-bottom: 1px solid #f1f5f9;
          }
          .ld-info-col {
            padding: 16px;
          }
          .ld-inner {
            padding: 14px 12px 80px;
          }
          .ld-topbar {
            margin-bottom: 14px;
          }
        }
      `}</style>

      <div className="ld-wrap">
        <div className="ld-inner">

          {/* Top bar */}
          <div className="ld-topbar">
            <button className="ld-back" onClick={function() { navigate(-1) }}>
              ← Back
            </button>
            <div className="ld-share-row">
              <button className="ld-share-wa" onClick={handleShareWA}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share
              </button>
              <button className="ld-copy" onClick={handleCopyLink}>
                {copied ? '✅ Copied!' : '🔗 Copy Link'}
              </button>
            </div>
          </div>

          {/* Main card */}
          <div className="ld-card">
            <div className="ld-grid">

              {/* Image column */}
              <div className="ld-img-col">
                <div className="ld-main-img">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={getImg(listing.images[activeImage])}
                      alt={listing.title}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>
                      🛍️
                    </div>
                  )}
                </div>

                {listing.images && listing.images.length > 1 && (
                  <div className="ld-thumb-row">
                    {listing.images.map(function(img, i) {
                      return (
                        <img
                          key={i}
                          src={getImg(img)}
                          alt={'thumb-' + i}
                          className={'ld-thumb' + (activeImage === i ? ' active' : '')}
                          onClick={function() { setActiveImage(i) }}
                        />
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Info column */}
              <div className="ld-info-col">

                {listing.category && (
                  <span className="ld-cat-tag">{listing.category}</span>
                )}

                <h1 className="ld-title">{listing.title}</h1>
                <p className="ld-price">{price}</p>

                <p className="ld-location">
                  📍 {listing.location?.area ? listing.location.area + ', ' : ''}
                  {listing.location?.city}{listing.location?.country ? ', ' + listing.location.country : ''}
                </p>

                {listing.description && (
                  <div style={{ marginBottom: '18px' }}>
                    <p className="ld-desc-label">Description</p>
                    <p className="ld-desc">{listing.description}</p>
                  </div>
                )}

                {listing.user && (
                  <div className="ld-seller"
                    onClick={function() { navigate('/profile/' + listing.user._id) }}>
                    <div className="ld-avatar">
                      {listing.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        {listing.user.name}
                      </p>
                      <p style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600, margin: '2px 0 0' }}>
                        ✔ Verified Seller
                      </p>
                    </div>
                    <span style={{ fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      View Profile →
                    </span>
                  </div>
                )}

                <p className="ld-posted">
                  Posted {new Date(listing.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div className="ld-safety">
                  ⚠️ <strong>Safety Tip:</strong> Always meet in a public place before exchanging money. SwiftKart is not responsible for transactions between users.
                </div>

                <button className="ld-wa-btn" onClick={handleWhatsApp}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contact Seller on WhatsApp
                </button>

                <button className="ld-report-btn"
                  onClick={function() { setShowReport(!showReport) }}>
                  🚩 Report this Listing
                </button>

              </div>
            </div>
          </div>

          {/* Report form */}
          {showReport && (
            <div className="ld-report-box">
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {REPORTS.map(function(r) {
                      return (
                        <label key={r} className="ld-radio-label">
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
                    className="ld-textarea"
                    value={reportDetails}
                    onChange={function(e) { setReportDetails(e.target.value) }}
                    placeholder="Provide more details..."
                    rows={3}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={function() { setShowReport(false) }}
                    style={{ flex: 1, background: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '11px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportLoading}
                    style={{ flex: 1, background: reportLoading ? '#fca5a5' : '#ef4444', color: 'white', border: 'none', padding: '11px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: reportLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                  >
                    {reportLoading ? 'Submitting...' : '🚩 Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </>
  )
}