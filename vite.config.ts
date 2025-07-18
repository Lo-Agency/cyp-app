import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // آدرس سرور بک‌اندت
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
