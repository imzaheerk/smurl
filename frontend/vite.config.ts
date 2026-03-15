import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  // Load .env from project root (parent of frontend/) so VITE_* vars work without a separate frontend/.env
  envDir: '..',
  server: {
    port: 5173,
    host: true // listen on 0.0.0.0 so you can open on mobile (same Wi‑Fi)
  }
});

