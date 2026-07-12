import LegalLayout from './LegalLayout'

const sections = [
  { title: 'Acceptance of Terms', content: `By accessing or using Scalablenexus ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Platform.\n\nThese terms apply to all users — buyers, sellers, service providers, event organisers, and accommodation listers.` },
  { title: 'Who We Are', content: `Scalablenexus is Zimbabwe's first dedicated campus marketplace — a platform where students buy, sell, find work, discover events, and secure housing.\n\nWe connect buyers and sellers directly. We do not handle payments or take commission. All transactions are conducted directly between users via WhatsApp and cash on delivery.` },
  { title: 'Eligibility', content: `To use Scalablenexus you must:\n• Be at least 16 years of age\n• Be a student, staff member, or community member affiliated with a campus or town in Zimbabwe\n• Provide accurate and truthful information during registration\n• Have a valid phone number capable of receiving WhatsApp messages` },
  { title: 'User Accounts', content: `You are responsible for:\n• Maintaining the confidentiality of your login credentials\n• All activity that occurs under your account\n• Notifying us immediately of any unauthorised use\n\nWe reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or harm other users.` },
  { title: 'Listing Rules', content: `All listings must:\n• Be accurate and not misleading\n• Include a real price — no price hiding or bait pricing\n• Include a working WhatsApp number\n• Be posted in the correct category\n• Not include prohibited items (see Section 6)\n\nDuplicate listings will be removed by our moderation team.` },
  { title: 'Prohibited Items & Content', content: `Strictly prohibited:\n• Illegal goods or substances of any kind\n• Weapons, ammunition, or explosives\n• Counterfeit, stolen, or fraudulently obtained items\n• Adult content or services\n• Hate speech, discriminatory content, or harassment\n• Pyramid schemes, MLM recruitment, or scam offers\n• Animals or wildlife products\n• Academic certificates, diplomas, or IDs (real or fake)\n• Items that infringe on intellectual property rights\n\nViolations result in immediate listing removal and account suspension.` },
  { title: 'Transactions & Safety', content: `Scalablenexus facilitates connections but does not participate in or guarantee any transaction.\n\nWe strongly recommend:\n• Meeting in public, well-lit locations on or near campus\n• Inspecting items before payment\n• Never sending money in advance\n• Trusting your instincts — if something feels wrong, do not proceed\n\nScalablenexus is not liable for any loss arising from transactions between users.` },
  { title: 'Intellectual Property', content: `All content on Scalablenexus — including the name, logo, design, code, and original text — is the intellectual property of Scalablenexus and may not be copied or used without written permission.\n\nBy posting content, you grant Scalablenexus a non-exclusive licence to display that content on the Platform.` },
  { title: 'Moderation & Enforcement', content: `Our admin team reviews reported content and may:\n• Remove listings that violate these terms\n• Warn or suspend user accounts\n• Permanently ban repeat offenders\n• Report illegal activity to relevant authorities\n\nAll reports are reviewed within 48 hours.` },
  { title: 'Limitation of Liability', content: `To the maximum extent permitted by law, Scalablenexus shall not be liable for:\n• Any loss of money, goods, or property from platform transactions\n• Any indirect, incidental, or consequential damages\n• Any content posted by users\n• Any interruption or unavailability of the platform\n\nThe Platform is provided "as is" without warranties of any kind.` },
  { title: 'Changes to These Terms', content: `We may update these Terms from time to time. Continued use after changes constitutes acceptance. We will notify users of significant changes via the app.` },
  { title: 'Governing Law', content: `These terms are governed by the laws of Zimbabwe. Any disputes shall be resolved under Zimbabwean jurisdiction.` },
  { title: 'Contact Us', content: `📧 support@scalablenexus.co.zw\n📱 WhatsApp: +91 73030 15894\n🌐 scalablenexus.vercel.app` },
]

export default function TermsOfUse() {
  return (
    <LegalLayout icon="📋" title="Terms of Use" lastUpdated="January 2025" intro="Please read these terms carefully. By using Scalablenexus you agree to be bound by this agreement.">
      {sections.map((s, i) => (
        <div key={i} className="ll-section">
          <div className="ll-section-header">
            <div className="ll-section-num">{i + 1}</div>
            <p className="ll-section-title">{s.title}</p>
          </div>
          <div className="ll-section-body">{s.content}</div>
        </div>
      ))}
    </LegalLayout>
  )
}