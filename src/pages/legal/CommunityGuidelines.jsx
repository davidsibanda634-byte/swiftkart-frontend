import LegalLayout from './LegalLayout'

const sections = [
  { title: 'Our Community Standard', content: `Scalablenexus works because our community trusts each other. Every member — buyer, seller, service provider, or event organiser — is expected to behave with honesty, respect, and integrity.\n\nViolating these guidelines may result in content removal, account suspension, or permanent ban.` },
  { title: 'The Do\'s — What We Expect', content: `✅ Post accurate, honest listings with real prices and real photos\n✅ Respond to buyers promptly and professionally on WhatsApp\n✅ Meet in public, safe locations for all transactions\n✅ Respect all users regardless of background, campus, or location\n✅ Report listings or users that violate these guidelines\n✅ Describe items honestly including any defects or damage\n✅ Post in the correct category so buyers can find your listing\n✅ Remove or update your listing when no longer available` },
  { title: 'The Don\'ts — What We Prohibit', content: `❌ Post misleading, exaggerated, or fraudulent listings\n❌ Ask buyers to send money in advance before meeting\n❌ Post illegal items, substances, or services of any kind\n❌ Harass, threaten, or disrespect other users\n❌ Post the same listing multiple times to game search rankings\n❌ Use fake photos or descriptions copied from other sources\n❌ Create multiple accounts to bypass a suspension or ban\n❌ Share personal data of other users without their consent` },
  { title: 'Prohibited Categories', content: `The following are never allowed on Scalablenexus regardless of context:\n• Illegal goods or controlled substances\n• Weapons, ammunition, explosives\n• Counterfeit or stolen goods\n• Adult content or sexual services\n• Live animals or wildlife products\n• Fake academic credentials or IDs\n• Pyramid schemes or MLM recruitment\n• Content that promotes hatred, discrimination, or violence` },
  { title: 'Enforcement Levels', content: `⚠️ Warning — First-time minor violations: listing removed, user notified.\n\n⏸️ Temporary Suspension — Repeated violations or moderately serious offences: 7–30 day posting suspension.\n\n🚫 Permanent Ban — Serious violations (fraud, illegal listings, harassment): permanent account removal, no appeal.\n\n🚔 Legal Referral — Illegal activity may be reported to Zimbabwe Republic Police or relevant authorities.` },
  { title: 'How to Report', content: `See something that violates these guidelines?\n\n1. Open the listing or user profile\n2. Tap the Report button\n3. Select the reason\n4. Submit — our team reviews within 48 hours\n\nYou can also contact us directly:\n📱 WhatsApp: +91 73030 15894\n📧 support@scalablenexus.co.zw` },
  { title: 'Changes to These Guidelines', content: `We may update these Community Guidelines as the platform evolves. Continued use after changes constitutes acceptance. We will notify users of significant changes through the app.` },
]

export default function CommunityGuidelines() {
  return (
    <LegalLayout icon="📜" title="Community Guidelines" lastUpdated="January 2025" intro="Scalablenexus works because our community trusts each other. These guidelines define the behaviour expected from every member of our platform.">
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