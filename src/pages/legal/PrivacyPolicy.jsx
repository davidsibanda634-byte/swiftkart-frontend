import LegalLayout from './LegalLayout'

const sections = [
  { title: 'Introduction', content: `Scalablenexus is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights.\n\nBy using Scalablenexus, you agree to the collection and use of information as described here.` },
  { title: 'Information We Collect', content: `Registration Information:\n• Full name, email address, phone number (WhatsApp), campus or city\n\nListing Information:\n• Titles, descriptions, prices, images, and location details\n\nUsage Information:\n• Pages visited, features used, search queries, device type, browser\n\nCommunications:\n• Reports you submit, messages sent to our support team` },
  { title: 'How We Use Your Information', content: `We use your data to:\n• Create and manage your account\n• Display your listings to other users\n• Enable buyers to contact you via WhatsApp\n• Improve Platform features and performance\n• Moderate content and enforce Community Guidelines\n• Send important notices about your account\n• Analyse usage to improve the user experience\n• Prevent fraud, abuse, and illegal activity` },
  { title: 'Sharing Your Information', content: `We do not sell your personal data to third parties.\n\nYour information may be shared:\n• Publicly visible profile: name, listings, and general location visible to other users\n• Service providers: trusted tools (cloud hosting, analytics) under strict confidentiality\n• Legal requirements: if required by law or to protect user safety\n• Business transfers: in the event of a merger, under the same privacy protections` },
  { title: 'Data Storage & Security', content: `Your data is stored on secure cloud servers with:\n• Encrypted connections (HTTPS)\n• Secure password hashing\n• Access controls limiting who can view your data\n\nNo method of transmission is 100% secure. We encourage you to use a strong password and never share your login credentials.` },
  { title: 'Cookies & Tracking', content: `We use cookies and similar technologies to:\n• Keep you logged in between sessions\n• Remember your preferences and filters\n• Analyse how users interact with the Platform\n\nSee our Cookie Policy for full details.` },
  { title: 'Your Rights', content: `You have the right to:\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your account and associated data\n• Withdraw consent for data processing where applicable\n• Request a copy of your data in a portable format\n\nContact: privacy@scalablenexus.co.zw` },
  { title: 'Data Retention', content: `We retain your data for as long as your account is active. If you delete your account:\n• Your profile and listings will be removed within 30 days\n• Some data may be retained for legal compliance for up to 12 months` },
  { title: "Children's Privacy", content: `Scalablenexus is not intended for children under 16. We do not knowingly collect data from children. If we become aware a child has provided data, we will delete it promptly.` },
  { title: 'Changes to This Policy', content: `We may update this Policy from time to time. Continued use after changes constitutes acceptance. We will notify users of significant changes through the Platform.` },
  { title: 'Contact Us', content: `📧 privacy@scalablenexus.co.zw\n📱 WhatsApp: +91 73030 15894\n🌐 scalablenexus.vercel.app` },
]

export default function PrivacyPolicy() {
  return (
    <LegalLayout icon="🔐" title="Privacy Policy" lastUpdated="January 2025" intro="Your privacy matters to us. This policy explains exactly what data we collect, why we collect it, and how you can control it.">
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