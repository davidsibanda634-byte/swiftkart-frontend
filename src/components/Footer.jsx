import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sk-footer {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
          padding: 40px 24px 28px;
          margin-top: 60px;
        }

        .sk-footer-inner {
          max-width: 1240px;
          margin: 0 auto;
        }

        .sk-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 32px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        /* Brand column */
        .sk-footer-brand-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .sk-footer-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }
        .sk-footer-logo-text {
          font-size: 18px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.4px;
        }
        .sk-footer-logo-text span { color: #34d399; }

        .sk-footer-tagline {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 18px;
          max-width: 280px;
        }

        .sk-footer-social-row {
          display: flex;
          gap: 10px;
        }

        .sk-social-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .sk-social-icon.live {
          background: rgba(37,211,102,0.15);
          border: 1px solid rgba(37,211,102,0.3);
        }
        .sk-social-icon.live:hover {
          background: rgba(37,211,102,0.25);
          transform: translateY(-2px);
        }
        .sk-social-icon.soon {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: default;
          opacity: 0.4;
          position: relative;
        }

        /* Link columns */
        .sk-footer-col-title {
          font-size: 12px;
          font-weight: 800;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin: 0 0 16px;
        }

        .sk-footer-link-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .sk-footer-link {
          color: rgba(255,255,255,0.65);
          font-size: 13.5px;
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 500;
        }
        .sk-footer-link:hover { color: #34d399; }

        .sk-footer-link-soon {
          color: rgba(255,255,255,0.3);
          font-size: 13.5px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: default;
        }

        .sk-soon-tag {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45);
          font-size: 9px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* Bottom bar */
        .sk-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          padding-top: 20px;
        }

        .sk-footer-copyright {
          color: rgba(255,255,255,0.4);
          font-size: 12.5px;
          margin: 0;
        }

        .sk-footer-made {
          color: rgba(255,255,255,0.35);
          font-size: 12.5px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .sk-footer { padding: 32px 18px 90px; } /* extra bottom padding clears BottomNav */
          .sk-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px 20px;
          }
          .sk-footer-brand-row { margin-bottom: 8px; }
          .sk-footer-tagline { max-width: none; margin-bottom: 14px; }
          .sk-footer-bottom { flex-direction: column; align-items: flex-start; gap: 6px; }
        }

        @media (max-width: 480px) {
          .sk-footer-grid { grid-template-columns: 1fr; gap: 24px; }
        }

        /* Desktop — no BottomNav, so normal padding */
        @media (min-width: 769px) {
          .sk-footer { padding: 40px 24px 28px; }
        }
      `}</style>

      <footer className="sk-footer">
        <div className="sk-footer-inner">

          <div className="sk-footer-grid">

            {/* Brand */}
            <div>
              <div className="sk-footer-brand-row">
                <div className="sk-footer-logo-icon">🛒</div>
                <span className="sk-footer-logo-text">Swift<span>Kart</span></span>
              </div>
              <p className="sk-footer-tagline">
                Zimbabwe's campus marketplace — buy, sell, and connect with students around you.
              </p>
              <div className="sk-footer-social-row">
                
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sk-social-icon live"
                  title="WhatsApp"
                >
                  💬
                </a>
                <span className="sk-social-icon soon" title="Instagram — coming soon">📷</span>
                <span className="sk-social-icon soon" title="Facebook — coming soon">👍</span>
                <span className="sk-social-icon soon" title="X (Twitter) — coming soon">✕</span>
              </div>
            </div>

            {/* Explore */}
            <div>
              <p className="sk-footer-col-title">Explore</p>
              <div className="sk-footer-link-list">
                <Link to="/marketplace" className="sk-footer-link">🛍️ Marketplace</Link>
                <Link to="/services" className="sk-footer-link">🧑‍💼 Services</Link>
                <Link to="/jobs" className="sk-footer-link">💼 Jobs</Link>
                <Link to="/events" className="sk-footer-link">🎉 Events</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="sk-footer-col-title">Company</p>
              <div className="sk-footer-link-list">
                <span className="sk-footer-link-soon">About Us <span className="sk-soon-tag">Soon</span></span>
                <span className="sk-footer-link-soon">Contact <span className="sk-soon-tag">Soon</span></span>
                <span className="sk-footer-link-soon">Privacy Policy <span className="sk-soon-tag">Soon</span></span>
                <span className="sk-footer-link-soon">Terms of Service <span className="sk-soon-tag">Soon</span></span>
              </div>
            </div>

          </div>

          <div className="sk-footer-bottom">
            <p className="sk-footer-copyright">© 2026 SwiftKart. All rights reserved.</p>
            <p className="sk-footer-made">Made for students, by students 🇿🇼</p>
          </div>

        </div>
      </footer>
    </>
  )
} 