import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: '/cyp-app/', // for GitHub pages
  plugins: [
    tailwindcss(),
  ],
})