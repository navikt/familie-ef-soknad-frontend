import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import autoprefixer from 'autoprefixer';

const basePath = '/familie/alene-med-barn/soknad/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    process.env.SENTRY_AUTH_TOKEN
      ? sentryVitePlugin({
          org: 'nav',
          url: 'https://sentry.gc.nav.no/',
          project: 'familie-ef-soknad',
          authToken: process.env.SENTRY_AUTH_TOKEN,
          release: {
            name: process.env.SENTRY_RELEASE,
          },
          errorHandler: (err) => {
            console.warn('Sentry Vite Plugin: ' + err.message);
          },
        })
      : undefined,
  ],
  define: {
    'process.env.PUBLIC_URL': JSON.stringify(basePath.slice(0, -1)),
    'process.env.BRUK_MOCK_LOKALT': JSON.stringify(process.env.BRUK_MOCK_LOKALT || false),
    'process.env.BRUK_DEV_API': JSON.stringify(process.env.BRUK_DEV_API || false),
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
