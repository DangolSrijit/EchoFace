import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      util: path.resolve(__dirname, 'node_modules/util/'),
      buffer: path.resolve(__dirname, 'node_modules/buffer/'),
    },
  },
  define: {
    global: 'window',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'window',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
});
