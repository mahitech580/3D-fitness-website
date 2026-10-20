import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS === 'true' ? '/3D-fitness-website/' : '/',
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 850,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three-vendor';
          if (id.includes('/node_modules/@react-three/') || id.includes('/node_modules/three-stdlib/')) return 'react-three-vendor';
          if (id.includes('/node_modules/framer-motion/')) return 'motion-vendor';
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
