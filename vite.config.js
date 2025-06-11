import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@packages': '/packages',
      '@core': '/packages/core',
      '@scenes': '/packages/scenes',
      '@gameobjects': '/packages/gameobjects',
      '@utils': '/packages/utils',
      '@shared': '/packages/shared',
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
