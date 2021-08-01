import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import tsconfigPaths from 'vite-tsconfig-paths';
import reactJsx from 'vite-react-jsx';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths(), reactJsx()],
  resolve: {
    alias: {
      'graphql-react-provider': resolve(__dirname, '..', 'graphql-react-provider', 'src'),
      'frontend': resolve(__dirname, '..', 'frontend', 'src'),
    },
  },
})
