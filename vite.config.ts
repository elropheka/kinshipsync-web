import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { copyFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const copyHtaccessPlugin = () => {
  return {
    name: 'copy-htaccess',
    closeBundle() {
      try {
        copyFileSync('.htaccess', 'dist/.htaccess');
        console.log('✅ .htaccess copied to dist/');
      } catch (err) {
        console.warn('⚠️ Could not copy .htaccess:', err);
      }
    },
  };
};

export default defineConfig({
  plugins: [react(), copyHtaccessPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
  server: {
    fs: {
      strict: true,
      allow: ['..']
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true
  }
});
