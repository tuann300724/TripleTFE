import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
  proxy: {
    "/momo": {
      target: "https://test-payment.momo.vn",
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/momo/, "")
    }
  }
}
})