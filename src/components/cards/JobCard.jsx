export default function JobCard({ job }) {
  const phone = job.phone?.replace(/\D/g, '') || ''
  const waLink = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hi, I am interested in the job: ' + job.title)

  function handleWhatsApp() {
    window.open(waLink, '_blank')
  }

  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .jc-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .jc-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(0,0,0,0.1); }

        .jc-icon {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .jc-info { flex: 1; min-width: 0; }

        .jc-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 3px;
        }

        .jc-title {
          font-weight: 700;
          font-size: 15px;
          color: #111827;
          margin: 0;
          line-height: 1.3;
        }

        .jc-posted {
          font-size: 10.5px;
          color: #c4c9d4;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
          padding-top: 2px;
        }

        .jc-company {
          color: #6b7280;
          font-size: 13px;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 500;
        }

        .jc-location {
          color: #9ca3af;
          font-size: 12px;
          margin: 0 0 14px;
        }

        .jc-desc {
          font-size: 12.5px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 14px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .jc-wa-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 9px 18px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: inherit;
          box-shadow: 0 3px 10px rgba(34,197,94,0.28);
          transition: all 0.2s ease;
        }
        .jc-wa-btn:hover { background: linear-gradient(135deg, #16a34a, #15803d); transform: translateY(-1px); box-shadow: 0 5px 14px rgba(34,197,94,0.38); }

        @media (max-width: 480px) {
          .jc-card { padding: 14px; gap: 10px; }
          .jc-icon { width: 46px; height: 46px; font-size: 20px; }
        }
      `}</style>

      <div className="jc-card">
        <div className="jc-icon">💼</div>

        <div className="jc-info">
          <div className="jc-top-row">
            <p className="jc-title">{job.title}</p>
            {postedDate && <span className="jc-posted">{postedDate}</span>}
          </div>

          {job.company && (
            <p className="jc-company">🏢 {job.company}</p>
          )}

          {job.description && (
            <p className="jc-desc">{job.description}</p>
          )}

          <p className="jc-location">
            📍 {job.location?.city}{job.location?.area ? ', ' + job.location.area : ''}
          </p>

          <button className="jc-wa-btn" onClick={handleWhatsApp}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact on WhatsApp
          </button>
        </div>
      </div>
    </>
  )
}