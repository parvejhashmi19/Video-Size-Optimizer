// Vite ki settings: React aur Tailwind plugins ko dev server aur build ke liye jodti hain.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
