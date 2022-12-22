import { resolve } from 'path';
import { defineConfig } from 'vite';
import { LIBRARY_NAME } from './shared';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, '../src/index.ts'),
      name: LIBRARY_NAME,
      fileName: 'index',
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {},
    outDir: resolve(__dirname, '../dist'),
  },
});
