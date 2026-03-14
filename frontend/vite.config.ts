import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true // listen on 0.0.0.0 so you can open on mobile (same Wi‑Fi)
  }
});

