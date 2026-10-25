import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectPagesBase = '/3D-fitness-website/';
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  plugins: [react()],
  // Local development stays at /; GitHub Pages needs the repository subpath.
  base: isGitHubPagesBuild ? projectPagesBase : '/',
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 4096,
    // The separately loaded WebGL vendor chunk is ~930 KB minified (~248 KB gzip).
    chunkSizeWarningLimit: 1000,
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
