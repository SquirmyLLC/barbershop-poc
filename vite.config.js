import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // relative URLs so the build works from any folder or static host
  build: { chunkSizeWarningLimit: 700 }, // three.js lives in its own lazy-loaded chunk
});
