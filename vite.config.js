import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import eslint from "vite-plugin-eslint"; // ESLint eklentisini yorum satırına alıyoruz

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // ESLint eklentisini kaldırıyoruz
});
