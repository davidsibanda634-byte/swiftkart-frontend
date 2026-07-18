import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Scalablenexus',
        short_name: 'Scalablenexus',
        description: 'Campus Marketplace Zimbabwe',
        theme_color: '#08162F',
        background_color: '#08162F',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Only cache the app shell — JS, CSS, HTML, fonts, icons
        // Nothing else — all data must come fresh from the network
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // No runtime caching at all
        // Every API call goes directly to the backend — always live data
        runtimeCaching: [],

        // Force new service worker to take over immediately
        skipWaiting: true,
        clientsClaim: true,
      }
    })
  ],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})