import { useNavigate } from 'react-router-dom'

export default function TermsOfUse() {
  const navigate = useNavigate()

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using Scalablenexus ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Platform.

These terms apply to all users of Scalablenexus, including buyers, sellers, service providers, event organisers, and accommodation listers.`
    },
    {
      title: '2. Who We Are',
      content: `Scalablenexus is Zimbabwe's first dedicated campus marketplace — a platform where students and community members buy, sell, find work, discover events, and secure housing.

We connect buyers and sellers directly. We do not handle payments, hold funds, or take commission on transactions. All transactions are conducted directly between users via WhatsApp and cash on delivery.`
    },
    {
      title: '3. Eligibility',
      content: `To use Scalablenexus you must:
- Be at least 16 years of age
- Be a student, staff member, or community member affiliated with a campus or town in Zimbabwe
- Provide accurate and truthful information during registration
- Have a valid phone number capable of receiving WhatsApp messages

By registering, you confirm that all information you provide is accurate and complete.`
    },
    {
      title: '4. User Accounts',
      content: `You are responsible for:
- Maintaining the confidentiality of your account credentials
- All activity that occurs under your account
- Notifying us immediately of any unauthorised use of your account

We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or harm other users or the platform.`
    },
    {
      title: '5. Listing Rules',
      content: `All listings posted on Scalablenexus must:
- Be accurate and not misleading
- Include a real price (no price hiding or price baiting)
- Include a working WhatsApp number
- Be posted in the correct category
- Not include prohibited items (see Section 6)

You may not post the same listing multiple times simultaneously. Duplicate listings will be removed by our moderation team.`
    },
    {
      title: '6. Prohibited Items & Content',
      content: `The following are strictly prohibited on Scalablenexus:
- Illegal goods or substances of any kind
- Weapons, ammunition, or explosives
- Counterfeit, stolen, or fraudulently obtained items
- Adult content or services
- Hate speech, discriminatory content, or harassment
- Pyramid schemes, MLM recruitment, or scam offers
- Animals or wildlife products
- Academic certificates, diplomas, or IDs (real or fake)
- Items that infringe on intellectual property rights

Violations will result in immediate listing removal and account suspension.`
    },
    {
      title: '7. Transactions & Safety',
      content: `Scalablenexus facilitates connections between buyers and sellers but does not participate in or guarantee any transaction.

We strongly recommend:
- Meeting in public, well-lit locations on or near campus
- Inspecting items before payment
- Never sending money in advance
- Trusting your instincts — if something feels wrong, do not proceed
- Using the Safe Meeting Zones suggested on campus listings

Scalablenexus is not liable for any loss, damage, or harm arising from transactions conducted between users.`
    },
    {
      title: '8. Intellectual Property',
      content: `All content on the Scalablenexus platform — including the name, logo, design, code, and original text — is the intellectual property of Scalablenexus and may not be copied, reproduced, or used without written permission.

By posting content on the Platform, you grant Scalablenexus a non-exclusive licence to display that content on the Platform and in promotional materials.`
    },
    {
      title: '9. Moderation & Enforcement',
      content: `Our admin team reviews reported content and may:
- Remove listings that violate these terms
- Warn or suspend user accounts
- Permanently ban repeat offenders
- Report illegal activity to relevant authorities

Users may report any listing or user using the Report button. All reports are reviewed within 48 hours.`
    },
    {
      title: '10. Limitation of Liability',
      content: `To the maximum extent permitted by law, Scalablenexus shall not be liable for:
- Any loss of money, goods, or property arising from platform transactions
- Any indirect, incidental, or consequential damages
- Any content posted by users
- Any interruption or unavailability of the platform

The Platform is provided "as is" without warranties of any kind.`
    },
    {
      title: '11. Changes to These Terms',
      content: `We may update these Terms of Use from time to time. Continued use of the Platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via the app or email where possible.`
    },
    {
      title: '12. Governing Law',
      content: `These terms are governed by the laws of Zimbabwe. Any disputes shall be resolved under Zimbabwean jurisdiction.`
    },
    {
      title: '13. Contact Us',
      content: `If you have questions about these Terms of Use, contact us at:
📧 support@scalablenexus.co.zw
📱 WhatsApp: +263 77 000 0000
🌐 scalablenexus.vercel.app`
    },
  ]

  return <LegalPage title="Terms of Use" icon="📋" lastUpdated="January 2025" sections={sections} navigate={navigate} />
}

function LegalPage({ title, icon, lastUpdated, sections, navigate }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .lg-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f7fb; min-height: 100vh; }
        .lg-header { background: linear-gradient(135deg, #08162F 0%, #0f2167 100%); padding: 28px 20px 32px; }
        .lg-header-inner { max-width: 760px; margin: 0 auto; }
        .lg-back {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8); padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex;
          align-items: center; gap: 5px; margin-bottom: 16px; transition: all 0.2s;
        }
        .lg-back:hover { background: rgba(255,255,255,0.18); color: white; }
        .lg-header-icon {
          width: 52px; height: 52px; background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18); border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 14px;
        }
        .lg-title { font-size: 26px; font-weight: 800; color: white; margin: 0 0 6px; letter-spacing: -0.5px; }
        .lg-updated { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 500; }
        .lg-content { max-width: 760px; margin: 0 auto; padding: 24px 20px 100px; }
        .lg-intro {
          background: white; border-radius: 16px; padding: 18px 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          margin-bottom: 16px; font-size: 13.5px; color: #374151; line-height: 1.8;
        }
        .lg-section {
          background: white; border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
          margin-bottom: 10px; overflow: hidden;
        }
        .lg-section-title {
          font-size: 14px; font-weight: 800; color: #08162F;
          padding: 16px 20px; border-bottom: 1px solid #f8fafc; margin: 0;
        }
        .lg-section-body {
          padding: 16px 20px; font-size: 13.5px; color: #374151;
          line-height: 1.85; white-space: pre-wrap;
        }
        .lg-footer {
          background: white; border-radius: 16px; padding: 18px 20px;
          border: 1px solid #f1f5f9; text-align: center; margin-top: 20px;
        }
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
          <div className="lg-intro">
            Please read these terms carefully before using Scalablenexus. This document forms a legally binding agreement between you and Scalablenexus regarding your use of the platform.
          </div>

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