import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "/", // for GitHub pages
  plugins: [tailwindcss()],
});
