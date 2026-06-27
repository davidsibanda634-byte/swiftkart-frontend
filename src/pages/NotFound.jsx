import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .nf-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: calc(100vh - 60px);
          background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .nf-card {
          text-align: center;
          max-width: 480px;
          width: 100%;
        }

        .nf-code {
          font-size: 100px;
          font-weight: 800;
          color: transparent;
          background: linear-gradient(135deg, #00C896, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin: 0 0 8px;
          letter-spacing: -4px;
        }

        .nf-icon {
          font-size: 52px;
          margin-bottom: 20px;
          display: block;
        }

        .nf-title {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin: 0 0 10px;
          letter-spacing: -0.5px;
        }

        .nf-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          margin: 0 0 32px;
        }

        .nf-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
        }

        .nf-links-label {
          font-size: 11px;
          font-weight: 800;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .nf-quick-links {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nf-quick-link {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.7);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .nf-quick-link:hover {
          background: rgba(255,255,255,0.14);
          color: white;
          transform: translateY(-1px);
        }

        .nf-home-btn {
          background: linear-gradient(135deg, #00C896, #059669);
          color: white;
          border: none;
          padding: 13px 32px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(0,200,150,0.4);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .nf-home-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,200,150,0.5);
        }

        .nf-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 28px 0;
        }

        .nf-brand {
          font-size: 13px;
          color: rgba(255,255,255,0.25);
          font-weight: 600;
        }
        .nf-brand span { color: #00C896; }

        @media (max-width: 480px) {
          .nf-code { font-size: 72px; }
          .nf-title { font-size: 20px; }
        }
      `}</style>

      <div className="nf-wrap">
        <div className="nf-card">

          <p className="nf-code">404</p>
          <span className="nf-icon">🔍</span>

          <h1 className="nf-title">Page not found</h1>
          <p className="nf-sub">
            The page you're looking for doesn't exist or may have been moved.
            Try heading back home or browsing one of the sections below.
          </p>

          <div className="nf-links">
            <p className="nf-links-label">Quick links</p>
            <div className="nf-quick-links">
              {[
                { label: '🛍️ Marketplace', path: '/marketplace' },
                { label: '🧑‍💼 Services', path: '/services' },
                { label: '💼 Jobs', path: '/jobs' },
                { label: '🎉 Events', path: '/events' },
              ].map(link => (
                <button
                  key={link.path}
                  className="nf-quick-link"
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <button className="nf-home-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>

          <hr className="nf-divider" />
          <p className="nf-brand">Scalable<span>nexus</span> — Campus Marketplace</p>

        </div>
      </div>
    </>
  )
}