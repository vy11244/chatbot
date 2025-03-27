import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Điểm đầu vào chính
        widget: resolve(__dirname, 'public/widget.js'), // Điểm đầu vào phụ
        embed: resolve(__dirname, 'public/embedScript.js') // Điểm đầu vào khác
      }
    }
  }
})
