import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

const env = globalThis.process?.env || {}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  base: env.FIGMA_PUBLIC_URL || '/',
  server: {
    port: env.FIGMA ? Number(env.PORT) : 5173,
    host: true, // Izinkan akses dari jaringan LAN (HP)
    strictPort: Boolean(env.FIGMA),
  },
})
