import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// FIX: Import 'dirname' from path and 'fileURLToPath' from url to define __dirname.
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// FIX: Define __dirname for ES module scope as it's not available by default.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: '/',
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Add support for multiple, comma-separated API keys
      'process.env.API_KEYS': JSON.stringify(env.API_KEYS ? env.API_KEYS.split(',').map(k => k.trim()) : [])
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './')
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          academy: resolve(__dirname, 'academy.html'),
        },
      },
    },
  }
})