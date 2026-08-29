const BACKEND = 'https://swiftkart2-backend.onrender.com/api'

const ENDPOINTS = {
  listing:       '/listings',
  service:       '/services',
  event:         '/events',
  accommodation: '/accommodations',
  job:           '/jobs',
}

export default async function handler(req, res) {
  const { id, type } = req.query

  // If this is a real browser request (not a crawler) redirect to the React app
  const ua = req.headers['user-agent'] || ''
  const isCrawler =
    /whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|googlebot|bingbot/i.test(ua)

  if (!isCrawler) {
    // Real user — send them to the React app
    res.setHeader('Location', '/' + (type === 'listing' ? 'listings' : type === 'accommodation' ? 'accommodation' : type + 's') + '/' + id)
    res.status(302).end()
    return
  }

  // Crawler detected — fetch listing data and return OG HTML
  try {
    const endpoint = ENDPOINTS[type] || '/listings'
    const response = await fetch(BACKEND + endpoint + '/' + id)

    if (!response.ok) throw new Error('Not found')

    const data = await response.json()

    const title   = data.title || 'Scalablenexus Listing'
    const price   = data.price ? '$' + Number(data.price).toLocaleString() : ''
    const city    = data.location?.city || ''
    const desc    = data.description
      ? data.description.slice(0, 150) + (data.description.length > 150 ? '...' : '')
      : (price ? price + (city ? ' · ' + city : '') : 'Campus Marketplace Zimbabwe')
    const image   = data.images?.[0] || 'https://scalablenexus.vercel.app/icon-512.png'
    const pageUrl = 'https://scalablenexus.vercel.app/' +
      (type === 'listing' ? 'listings' : type === 'accommodation' ? 'accommodation' : type + 's') +
      '/' + id

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title} — Scalablenexus</title>

  <!-- Open Graph — used by WhatsApp, Facebook, Telegram -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${pageUrl}" />
  <meta property="og:title"       content="${title}${price ? ' — ' + price : ''}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image"       content="${image}" />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="800" />
  <meta property="og:site_name"   content="Scalablenexus" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${title}${price ? ' — ' + price : ''}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image"       content="${image}" />

  <!-- Redirect real users to the React app immediately -->
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${pageUrl}">${title}</a>...</p>
</body>
</html>`

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    res.status(200).send(html)

  } catch {
    // Fallback — just send them to the React app
    res.setHeader('Location', '/')
    res.status(302).end()
  }
}