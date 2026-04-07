import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import tailwindcss from '@tailwindcss/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      dts: false,
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
      // Enable SW + manifest in dev so beforeinstallprompt can be tested on localhost
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'CSC News',
        short_name: 'CSC News',
        description: 'Catholic Cambodia news and daily content.',
        theme_color: '#3d6d9e',
        background_color: '#f7f6f3',
        // Prefer PWA over related Play Store listings when both exist (Android)
        prefer_related_applications: false,
        // Use full display when installed (no browser/OS chrome around the app)
        display: 'fullscreen',
        display_override: ['fullscreen', 'standalone', 'minimal-ui'],
        start_url: '/',
        scope: '/',
        // Chrome requires PNG icons (192 + 512) for installability; SVG-only often blocks beforeinstallprompt
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/admin/, /^\/login/],
      },
    }),

  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'font-family': "'Kantumruy', 'KoHo', sans-serif",
        },
        javascriptEnabled: true,
      },
    },
  },
})
