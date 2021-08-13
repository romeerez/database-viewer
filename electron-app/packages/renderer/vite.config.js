/* eslint-env node */

import { chrome } from '../../electron-vendors.config.json';
import { join, resolve } from 'path';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import { loadAndSetEnv } from '../../scripts/loadAndSetEnv.mjs';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactJsx from 'vite-react-jsx';

const PACKAGE_ROOT = __dirname;

/**
 * Vite looks for `.env.[mode]` files only in `PACKAGE_ROOT` directory.
 * Therefore, you must manually load and set the environment variables from the root directory above
 */
loadAndSetEnv(process.env.MODE, process.cwd());

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  root: PACKAGE_ROOT,
  plugins: [reactRefresh(), tsconfigPaths(), reactJsx()],
  base: '',
  server: {
    fsServe: {
      root: join(PACKAGE_ROOT, '../../'),
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2,
      },
      safari10: false,
    },
    rollupOptions: {
      external: [...builtinModules],
    },
    emptyOutDir: true,
  },
});
