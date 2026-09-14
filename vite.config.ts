import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';

const basePath = '/familie/alene-med-barn/soknad/';

export default defineConfig({
  base: basePath,
  plugins: [react()],
  define: {
    'process.env.PUBLIC_URL': JSON.stringify(basePath.slice(0, -1)),
    'process.env.BRUK_MOCK_LOKALT': JSON.stringify(process.env.BRUK_MOCK_LOKALT || false),
    'process.env.BRUK_DEV_API': JSON.stringify(process.env.BRUK_DEV_API || false),
  },
  server: {
    hmr: {
      port: 24679,
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
