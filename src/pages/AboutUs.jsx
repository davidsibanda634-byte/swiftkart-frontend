import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function AboutUs() {
  const navigate = useNavigate()

  const stats = [
    { num: '5+', label: 'Sections' },
    { num: '🇿🇼', label: 'Zimbabwe' },
    { num: '100%', label: 'Free' },
    { num: '📱', label: 'Mobile First' },
  ]

  const values = [
    { icon: '🤝', title: 'Community First', body: 'We build for students, by people who understand the campus experience. Every feature is designed around real problems that real students face every day in Zimbabwe.' },
    { icon: '🔒', title: 'Safety & Trust', body: 'We invest in verification, moderation, and safety guidelines because we know that trust is the foundation of every successful transaction.' },
    { icon: '📱', title: 'Mobile First', body: 'Zimbabwe runs on mobile. Every pixel of Scalablenexus is designed for the phone in your pocket, not a desktop you might not have.' },
    { icon: '🌍', title: 'Local Context', body: 'We do not copy and paste foreign solutions onto African problems. WhatsApp contact, cash on delivery, campus-specific filtering — everything is built for how things actually work here.' },
    { icon: '⚡', title: 'Speed & Accessibility', body: 'We optimise for low data environments. The app loads fast even on slow connections, and works offline for previously visited content thanks to PWA technology.' },
    { icon: '💚', title: 'Student Empowerment', body: 'Scalablenexus is not just a marketplace. It is a platform that helps students earn income, find opportunities, and build a network — all within their campus community.' },
  ]

  const sections = [
    { icon: '🛍️', color: '#00C896', title: 'Marketplace', body: 'Buy and sell fashion, electronics, furniture, food and more with fellow students. Direct WhatsApp contact, no middlemen.' },
    { icon: '🧑‍💼', color: '#7c3aed', title: 'Services', body: 'Students with skills can offer tutoring, design, photography, tech help and more to their campus community.' },
    { icon: '💼', color: '#d97706', title: 'Jobs & Opportunities', body: 'Internships, part-time work, freelance gigs and campus opportunities — posted specifically for students.' },
    { icon: '🎉', color: '#be185d', title: 'Events', body: 'Workshops, concerts, social gatherings and campus activities all in one organised feed.' },
    { icon: '🏠', color: '#0f4c81', title: 'Accommodation', body: 'Rooms, apartments and houses for rent or sale near campus — with detailed filters and WhatsApp contact.' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ab-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }

        .ab-hero {
          background: linear-gradient(135deg, #08162F 0%, #0f2167 100%);
          padding: 28px 20px 40px; position: relative; overflow: hidden;
        }
        .ab-hero::after {
          content: ''; position: absolute; bottom: -40px; left: 0; right: 0; height: 80px;
          background: #f4f7fb; border-radius: 50% 50% 0 0 / 40px 40px 0 0;
        }
        .ab-hero-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }
        .ab-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 24px; transition: all 0.2s; }
        .ab-back:hover { background: rgba(255,255,255,0.18); color: white; }

        .ab-logo { width: 64px; height: 64px; background: linear-gradient(135deg, #00C896, #059669); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 30px; margin-bottom: 18px; box-shadow: 0 8px 28px rgba(0,200,150,0.4); }
        .ab-brand { font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px; letter-spacing: -0.5px; }
        .ab-brand span { color: #00C896; }
        .ab-tagline { font-size: 14px; color: rgba(255,255,255,0.6); margin: 0 0 28px; line-height: 1.6; }

        .ab-stats { display: flex; gap: 8px; }
        .ab-stat { flex: 1; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 12px 8px; text-align: center; }
        .ab-stat-num { font-size: 18px; font-weight: 800; color: white; }
        .ab-stat-label { font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.3px; }

        .ab-content { max-width: 760px; margin: 0 auto; padding: 48px 20px 100px; }

        .ab-section-label { font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 12px; }
        .ab-section-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 14px; letter-spacing: -0.4px; }

        .ab-story {
          background: white; border-radius: 16px; padding: 22px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          font-size: 14px; color: #374151; line-height: 1.85; margin-bottom: 28px;
        }
        .ab-story p { margin: 0 0 14px; }
        .ab-story p:last-child { margin: 0; }

        .ab-values-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
        .ab-value-card { background: white; border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
        .ab-value-icon { font-size: 26px; margin-bottom: 10px; }
        .ab-value-title { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
        .ab-value-body { font-size: 12.5px; color: #6b7280; line-height: 1.7; margin: 0; }

        .ab-sections-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .ab-section-card { background: white; border-radius: 14px; padding: 16px 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; display: flex; gap: 14px; align-items: flex-start; }
        .ab-section-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .ab-section-name { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
        .ab-section-desc { font-size: 13px; color: #6b7280; line-height: 1.6; margin: 0; }

        .ab-cta { background: linear-gradient(135deg, #08162F, #0f2167); border-radius: 20px; padding: 28px 24px; text-align: center; margin-bottom: 20px; }
        .ab-cta-title { font-size: 20px; font-weight: 800; color: white; margin: 0 0 8px; }
        .ab-cta-sub { font-size: 13px; color: rgba(255,255,255,0.55); margin: 0 0 20px; }
        .ab-cta-btn { display: inline-flex; align-items: center; gap: 7px; background: linear-gradient(135deg, #00C896, #059669); color: white; border: none; padding: 13px 28px; border-radius: 50px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: inherit; text-decoration: none; box-shadow: 0 6px 20px rgba(0,200,150,0.4); transition: all 0.2s; }
        .ab-cta-btn:hover { transform: translateY(-2px); }

        .ab-contact { background: white; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .ab-contact-title { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 14px; }
        .ab-contact-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #374151; margin-bottom: 10px; font-weight: 500; }
        .ab-contact-item:last-child { margin-bottom: 0; }

        @media (max-width: 768px) {
          .ab-content { padding: 40px 14px 100px; }
          .ab-hero { padding: 20px 16px 40px; }
          .ab-values-grid { grid-template-columns: 1fr; }
          .ab-stats { gap: 6px; }
        }
      `}</style>

      <div className="ab-root">
        <div className="ab-hero">
          <div className="ab-hero-inner">
            <button className="ab-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="ab-logo">🛒</div>
            <p className="ab-brand">Scalable<span>nexus</span></p>
            <p className="ab-tagline">Zimbabwe's first dedicated campus marketplace — your campus, your community, your opportunity.</p>
            <div className="ab-stats">
              {stats.map(s => (
                <div key={s.label} className="ab-stat">
                  <div className="ab-stat-num">{s.num}</div>
                  <div className="ab-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ab-content">

          <p className="ab-section-label">Our Story</p>
          <div className="ab-story">
            <p>Scalablenexus was born out of frustration. Every campus in Zimbabwe has the same problem — students trying to sell textbooks on WhatsApp groups that move too fast, searching for accommodation through word of mouth, missing out on events they didn't know existed, and applying for jobs they heard about too late.</p>
            <p>We asked a simple question: what if there was one place — purpose-built for campus life in Zimbabwe — where all of this was organised, searchable, and easy to use?</p>
            <p>The answer is Scalablenexus. A marketplace. A job board. An events platform. A property finder. A services hub. All in one app, built specifically for the Zimbabwean campus community.</p>
            <p>We are not trying to be Amazon or Facebook. We are trying to be the platform that understands exactly what it means to be a student in Zimbabwe — the data constraints, the cash economy, the WhatsApp culture, the campus geography — and builds something that actually fits.</p>
          </div>

          <p className="ab-section-label">Our Values</p>
          <div className="ab-values-grid">
            {values.map((v, i) => (
              <div key={i} className="ab-value-card">
                <div className="ab-value-icon">{v.icon}</div>
                <p className="ab-value-title">{v.title}</p>
                <p className="ab-value-body">{v.body}</p>
              </div>
            ))}
          </div>

          <p className="ab-section-label">What We Offer</p>
          <div className="ab-sections-list">
            {sections.map((s, i) => (
              <div key={i} className="ab-section-card">
                <div className="ab-section-icon" style={{ background: s.color + '18' }}>{s.icon}</div>
                <div>
                  <p className="ab-section-name">{s.title}</p>
                  <p className="ab-section-desc">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="ab-cta">
            <p className="ab-cta-title">Join the Community</p>
            <p className="ab-cta-sub">Free to join. Free to post. Free to grow.</p>
            <Link to="/register" className="ab-cta-btn">🚀 Get Started Free</Link>
          </div>

          <div className="ab-contact">
            <p className="ab-contact-title">Get In Touch</p>
            <div className="ab-contact-item">📧 support@scalablenexus.co.zw</div>
            <div className="ab-contact-item">📱 WhatsApp: +917303015894</div>
            <div className="ab-contact-item">🌐 scalablenexus.vercel.app</div>
            <div className="ab-contact-item">📍 Zimbabwe 🇿🇼</div>
          </div>

        </div>
      </div>
    </>
  )
}