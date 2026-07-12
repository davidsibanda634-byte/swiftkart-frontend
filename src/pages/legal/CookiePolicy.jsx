import LegalLayout from './LegalLayout'

const cookieTypes = [
  { title: 'Essential Cookies — Required', content: `These cookies are required for the Platform to function. They keep you logged in, remember your session, and enable core features. These cannot be disabled.\n\nExamples: session tokens, authentication cookies.` },
  { title: 'Analytics Cookies — Optional', content: `These help us understand how users interact with the Platform — which pages are visited most, where users drop off, and how to improve the experience. Data is anonymous and aggregated.` },
  { title: 'Performance Cookies — Optional', content: `These store cached data locally on your device to make the Platform load faster on repeat visits — especially important for users on slow connections in Zimbabwe.` },
  { title: 'Preference Cookies — Optional', content: `These remember your settings and preferences, such as your last selected category, search filters, and recently viewed listings.` },
  { title: 'What Are Cookies?', content: `Cookies are small text files stored on your device when you visit a website. Scalablenexus also uses localStorage and sessionStorage — which work the same way but are stored differently on your device.` },
  { title: 'How to Control Cookies', content: `Control cookies through your browser settings:\n• Chrome: Settings → Privacy and Security → Cookies\n• Firefox: Options → Privacy & Security\n• Safari: Preferences → Privacy\n• Samsung Internet: Settings → Privacy\n\nNote: Disabling essential cookies will prevent login and key Platform features.` },
  { title: 'Third-Party Services', content: `We use a small number of trusted third-party services:\n• Google Fonts — for loading our typeface. No personal data collected.\n• Cloudinary — for image hosting and delivery.\n• Render — our backend hosting provider.\n\nWe do not use advertising cookies or tracking cookies from ad networks.` },
  { title: 'Contact', content: `📧 privacy@scalablenexus.co.zw\n📱 WhatsApp: +91 73030 15894` },
]

export default function CookiePolicy() {
  return (
    <LegalLayout icon="🍪" title="Cookie Policy" lastUpdated="January 2025" intro="Scalablenexus uses cookies to keep the Platform working and to improve your experience. This policy explains exactly what we use and why.">
      {cookieTypes.map((s, i) => (
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