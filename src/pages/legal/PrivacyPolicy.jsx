import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  const sections = [
    {
      title: '1. Introduction',
      content: `Scalablenexus ("we", "our", "the Platform") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data.

By using Scalablenexus, you agree to the collection and use of information as described in this policy.`
    },
    {
      title: '2. Information We Collect',
      content: `We collect the following types of information:

Registration Information:
- Full name
- Email address
- Phone number (WhatsApp)
- Campus or city

Listing Information:
- Titles, descriptions, prices, images, and location details you provide when posting listings

Usage Information:
- Pages visited, features used, search queries
- Device type, browser, and approximate location
- Time and frequency of access

Communications:
- Reports you submit about other users or listings
- Messages sent to our support team`
    },
    {
      title: '3. How We Use Your Information',
      content: `We use your information to:
- Create and manage your account
- Display your listings to other users
- Enable buyers to contact you via WhatsApp
- Improve the Platform's features and performance
- Moderate content and enforce our Community Guidelines
- Send important notices about your account or listings
- Analyse usage patterns to improve the user experience
- Prevent fraud, abuse, and illegal activity on the Platform`
    },
    {
      title: '4. Sharing Your Information',
      content: `We do not sell your personal data to third parties.

Your information may be shared in the following limited cases:
- Publicly visible profile: Your name, listings, and general location are visible to other users on the Platform
- Service providers: We may use trusted third-party tools (such as cloud hosting and analytics) that process data on our behalf under strict confidentiality agreements
- Legal requirements: We may disclose information if required by law or to protect the rights and safety of users or the public
- Business transfers: In the event of a merger or acquisition, your data may be transferred to the new entity under the same privacy protections`
    },
    {
      title: '5. Data Storage & Security',
      content: `Your data is stored on secure cloud servers. We use industry-standard security measures including:
- Encrypted connections (HTTPS)
- Secure password hashing
- Access controls limiting who can view your data

However, no method of internet transmission is 100% secure. We cannot guarantee absolute security and encourage you to use a strong password and not share your login credentials.`
    },
    {
      title: '6. Cookies & Tracking',
      content: `We use cookies and similar technologies to:
- Keep you logged in between sessions
- Remember your preferences and filters
- Analyse how users interact with the Platform
- Improve loading speed through caching

You can control cookie settings through your browser. Disabling cookies may affect some Platform features. See our full Cookie Policy for details.`
    },
    {
      title: '7. Your Rights',
      content: `You have the right to:
- Access the personal data we hold about you
- Request correction of inaccurate data
- Request deletion of your account and associated data
- Withdraw consent for data processing where applicable
- Request a copy of your data in a portable format

To exercise any of these rights, contact us at support@scalablenexus.co.zw`
    },
    {
      title: '8. Data Retention',
      content: `We retain your personal data for as long as your account is active or as needed to provide services. If you delete your account:
- Your profile and listings will be removed within 30 days
- Some data may be retained for legal compliance or fraud prevention purposes for up to 12 months`
    },
    {
      title: '9. Children\'s Privacy',
      content: `Scalablenexus is not intended for children under the age of 16. We do not knowingly collect personal data from children. If we become aware that a child under 16 has provided personal data, we will delete it promptly.`
    },
    {
      title: '10. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify users of significant changes through the Platform or via email. Continued use of the Platform after changes constitutes acceptance.`
    },
    {
      title: '11. Contact Us',
      content: `For privacy-related questions or to exercise your rights:
📧 privacy@scalablenexus.co.zw
📱 WhatsApp: +91303015894
🌐 scalablenexus.vercel.app`
    },
  ]

  return (
    <LegalPage
      title="Privacy Policy"
      icon="🔐"
      lastUpdated="January 2025"
      sections={sections}
      navigate={navigate}
      intro="Your privacy matters to us. This policy explains exactly what data we collect about you, why we collect it, and how you can control it."
    />
  )
}

function LegalPage({ title, icon, lastUpdated, sections, navigate, intro }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .lg-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }
        .lg-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 20px 32px; }
        .lg-header-inner { max-width: 760px; margin: 0 auto; }
        .lg-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s; }
        .lg-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .lg-header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; }
        .lg-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 6px; letter-spacing: -0.5px; }
        .lg-updated { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 500; }
        .lg-content { max-width: 760px; margin: 0 auto; padding: 24px 20px 100px; }
        .lg-intro { background: white; border-radius: 16px; padding: 18px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 16px; font-size: 13.5px; color: #374151; line-height: 1.8; }
        .lg-section { background: white; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; margin-bottom: 10px; overflow: hidden; }
        .lg-section-title { font-size: 14px; font-weight: 800; color: #08162F; padding: 16px 20px; border-bottom: 1px solid #f8fafc; margin: 0; }
        .lg-section-body { padding: 16px 20px; font-size: 13.5px; color: #374151; line-height: 1.85; white-space: pre-wrap; }
        .lg-footer { background: white; border-radius: 16px; padding: 18px 20px; border: 1px solid #f1f5f9; text-align: center; margin-top: 20px; }
        .lg-footer-brand { font-size: 16px; font-weight: 800; color: #08162F; margin: 0 0 4px; }
        .lg-footer-brand span { color: #00C896; }
        .lg-footer-sub { font-size: 12px; color: #9ca3af; margin: 0; }
        @media (max-width: 768px) { .lg-content { padding: 16px 14px 100px; } .lg-header { padding: 20px 16px 24px; } }
      `}</style>

      <div className="lg-root">
        <div className="lg-header">
          <div className="lg-header-inner">
            <button className="lg-back" onClick={() => navigate(-1)}>← Back</button>
            <div className="lg-header-icon">{icon}</div>
            <h1 className="lg-title">{title}</h1>
            <p className="lg-updated">Last updated: {lastUpdated}</p>
          </div>
        </div>
        <div className="lg-content">
          {intro && <div className="lg-intro">{intro}</div>}
          {sections.map((s, i) => (
            <div key={i} className="lg-section">
              <p className="lg-section-title">{s.title}</p>
              <div className="lg-section-body">{s.content}</div>
            </div>
          ))}
          <div className="lg-footer">
            <p className="lg-footer-brand">Scalable<span>nexus</span></p>
            <p className="lg-footer-sub">Built for campus. Built for Zimbabwe. 🇿🇼</p>
          </div>
        </div>
      </div>
    </>
  )
}