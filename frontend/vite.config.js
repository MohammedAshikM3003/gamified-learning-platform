import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_PATH || '/',
    server: {
      port: 5173,
      strictPort: true,
    },
    plugins: [
      tailwindcss(),
      react(),
    ],
    optimizeDeps: {
      exclude: ['firebase', 'firebase/auth', 'firebase/analytics'],
    },
  }
})
