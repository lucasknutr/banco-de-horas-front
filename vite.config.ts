import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh';
import replace from '@rollup/plugin-replace';
// https://vitejs.dev/config/

import { loadEnv } from 'vite';
const env = loadEnv('', process.cwd());
const envReplace = replace({
  'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
});

export default defineConfig({
  plugins: [
    react(),
    reactRefresh(),
    envReplace,
  ],
  base: '/banco-de-horas-front/',
})

