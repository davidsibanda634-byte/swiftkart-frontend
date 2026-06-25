import React from 'react'

export default function linkify(text) {
  if (!text) return null
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map(function(part, i) {
    const isUrl = urlRegex.test(part)
    urlRegex.lastIndex = 0

    if (isUrl) {
      return React.createElement(
        'a',
        {
          key: i,
          href: part,
          target: '_blank',
          rel: 'noopener noreferrer',
          style: {
            color: '#2563EB',
            fontWeight: 600,
            textDecoration: 'underline',
            wordBreak: 'break-all'
          }
        },
        part
      )
    }

    return part
  })
}