import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // autoUpdate silently updates the service worker in background
      registerType: 'autoUpdate',

      // Assets to precache in the app shell
      includeAssets: ['favicon.ico', 'favicon.svg', 'icon-192.png', 'icon-512.png'],

      // devOptions allows testing PWA install in development
      devOptions: {
        enabled: true,
      },

      manifest: {
        name: 'Scalablenexus',
        short_name: 'Scalablenexus',
        description: 'Campus Marketplace Zimbabwe — Buy, sell, find services, jobs and events near your campus.',
        theme_color: '#08162F',
        background_color: '#08162F',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/?source=pwa',
        scope: '/',
        lang: 'en',
        categories: ['shopping', 'business', 'lifestyle'],

        // ── Icons ──
        // Chrome requires BOTH a 192px icon AND a 512px maskable icon
        // to trigger the beforeinstallprompt event.
        // Having them as separate entries (not combined purpose) is more reliable.
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        // Cache only the app shell — JS, CSS, HTML, icons, fonts
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // No runtime caching — all API calls always go to network
        // This ensures new listings always appear on refresh
        runtimeCaching: [],

        // Force new service worker to activate immediately
        skipWaiting: true,
        clientsClaim: true,

        // Increase the max cache size for the app shell
        // Default is 2MB which is often too small for a full React app
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
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