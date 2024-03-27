import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import { checker } from 'vite-plugin-checker';

// Pull the ports from the environment or default to 3000 / 3001
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const backend_port = process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT) : 3001;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // run the server on a specified port
    port,
    // proxy the /api requests to a local the backend
    proxy: {
      '/api': {
        // use any target you want for playing around with api calls
        target: `http://localhost:${backend_port}`,
        changeOrigin: true,
      }
    }
  },
  // some node_modules have not updated to esm and throw warnings in a build
  // Use this to suppress those warnings
  build: {
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      }
    }
  },
  resolve: {
    // alias the src directory for easy imports
    // '../../../components/MyThing' becomes '@components/MyThing'
    alias: [
      { find: '@assets', replacement: '/src/assets' },
      { find: '@components', replacement: '/src/components' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@app', replacement: '/src/app' },
      { find: '@features', replacement: '/src/features' },
      { find: '@hooks', replacement: '/src/hooks' },
      { find: '@styles', replacement: '/src/styles' },
      { find: '@helpers', replacement: '/src/helpers' },
      { find: '@stores', replacement: '/src/stores' },
      { find: '@services', replacement: '/src/services' },
      { find: '@root', replacement: '/src' },
    ],
  },
  plugins: [
  // Plugins to handle https (plus the cert)
    mkcert(),
    // Need that react plugin
    react(),
    // Plugins to check typescript WHILE you develop
    checker({
      typescript: true
    })
  ],
})